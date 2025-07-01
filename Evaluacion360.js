class Evaluacion360 extends SelvaApplication {

    periodos = KDataList();
    evaluados = KDataList();
    competencias = [];
    indice = 0;
    selectorPeriodo = KSelect(this.periodos, "idPeriodo")
    selectorEvaluados = KSelect(this.evaluados, "idEvaluado")
    evaluaciones = [];
    botones = [];
    CARGAR_EVALUADOS = "CARGAR_EVALUADOS_PARA_360";
    CARGAR_EVALUACIONES = "CARGAR_EVALUACIONES_360";
    GUARDAR_ITEM_EVALUACION = "GUARDAR_ITEM_EVALUACION_360";
    CARGAR_COMPETENCIAS = "CARGAR_COMPETENCIAS_360";

    getInitScreen() {
        let initScreen = super.getInitScreen();

        initScreen.add(

            KColumn(
                KRow(
                    KLabel("Periodo"),
                    this.selectorPeriodo
                        .addEvent("change", () => this.loadData2()),
                    KLabel("Evaluado"),
                    this.selectorEvaluados
                        .addEvent("change", () => this.loadData3()),
                )
                    .center()
                ,
                KColumn(
                    KColumn(
                        KLabel("", "COMPETENCIA")
                            .addCssText("font-size: 2em; font-weight: bold; color:navy;")
                            .addCssText("margin: 8px;")
                        ,
                        KParagraph("", "COMPORTAMIENTO")
                            .addCssText("font-size: 1.5em; font-weight: bold; color:royalblue;")
                            .addCssText("margin: 0px 16px 0px 16px; padding: 32px;")
                            .applySimpleRoundedBorder()
                            .setShadow()
                        ,

                        KRow(
                            KButton("No satisfactorio")
                                .addCssText("background-color: red; color: white;")
                                .getMe((me) => this.botones.push(me))
                                .addEvent("click", () => { this.sincronizar(1, 1) })
                            ,
                            KButton("Regular")
                                .addCssText("background-color: orange; color: white;")
                                .getMe((me) => this.botones.push(me))
                                .addEvent("click", () => { this.sincronizar(1, 2) })
                            ,
                            KButton("Satisfactorio")
                                .addCssText("background-color: yellow; color: black;")
                                .getMe((me) => this.botones.push(me))
                                .addEvent("click", () => { this.sincronizar(1, 3) })
                            ,
                            KButton("Sobresaliente")
                                .addCssText("background-color: green; color: white;")
                                .getMe((me) => this.botones.push(me))
                                .addEvent("click", () => { this.sincronizar(1, 4) })

                        )
                            .addCssText("margin-left:auto;margin-right:auto; gap: 16px;")
                            .addCssTextOnChildren("flex: 1 1 auto; width: 180px; height: 60px; font-size:1.5em")

                        ,

                        KRow(
                            //Flecha atrás
                            KButton("⬅️")
                                .addEvent("click", () => { this.sincronizar(-1) })
                            ,

                            //Flecha adelante
                            KButton("➡️")
                                .addEvent("click", () => { this.sincronizar(1) })
                        )

                            .addCssTextOnChildren("flex: 1 1 auto; width: 64px; height: 64px; font-size:2em")



                    )
                        .setSize("75vw", "100%")

                        .applySimpleRoundedBorder()
                        .spaceBetween()

                )
                    .setSize("100%", "100%")
                    .center()


            )
                .addCssTextOnChildren("padding: 8px; gap: 8px;")
                .setSize("100%", "100%")

        )


        this.initScreen = initScreen;
        return initScreen;
    }


    sincronizar(n, calificacion) {

        if (calificacion) {
            let c = this.evaluaciones[this.indice];

            if (c == undefined) {
                c = {
                    "idEvaluado": this.selectorEvaluados.getValue(),
                    "idPeriodo": this.selectorPeriodo.getValue(),
                    "idEvaluador": SelvaApplication.user.payload.CEDULA,
                    "calificacion": calificacion,
                    "idItem": this.competencias[this.indice].id,
                    "fechaEvaluacion": new Date().toMySQL(),
                    "id": 0,
                    "indice": this.indice
                };
                this.evaluaciones[this.indice] = c;
            } else {
                this.evaluaciones[this.indice].calificacion = calificacion;
                this.evaluaciones[this.indice].fechaEvaluacion = new Date().toMySQL();
            }


            //Verificamos la conexión
            if (!navigator.onLine) {
                alert("La conexión a Internet ha fallado o está inestable. Por favor revisa tu conexión y vuelve a pulsar el botón de calificación.");
                return;
            }


            this.guardar(this.indice);
        }

        this.indice += n;

        if (this.indice < 0) this.indice = 0;
        if (this.indice == this.competencias.length) {
            alert("Ha llegado al final de la evaluación. Gracias por participar.");
            this.navigationController.back();
        }

        this.initScreen.setData(this.competencias[this.indice]);

        debugger;
        //Limpiamos los bordes de los botones
        for (let i = 0; i < 4; i++) {
            this.botones[i].addCssText("box-shadow: none; border: 1px solid black;");
        }
        //Pintamos el borde el botón de la calificacion correspondiente
        if (this.evaluaciones[this.indice]) {
            let calificacion = this.evaluaciones[this.indice].calificacion;
            if (calificacion > 0) {
                this.botones[calificacion - 1].addCssText("box-shadow: 10px 10px 5px lightblue; border: 4px solid black;");
            }
        }
    }


    guardar(indice) {

        //Grabamos esta pregunta en la base de datos:
        this.evaluaciones[this.indice].indice = indice; //Guardamos el indice
        KMessage("servidor", this.evaluaciones[indice], this.GUARDAR_ITEM_EVALUACION)
            .send(this.server)
            .then(data => {
                let obj = JSON.parse(data);
                this.evaluaciones[obj.indice].id = obj.id;
            })
            .catch(err => { console.log(err); });

    }

    // Cargamos la evaluación para el evaluado seleccionado
    // Si no lo hay entonces creamos la evaluación
    loadData3() {

        let steps = KStepsCounter(2, () => {
            this.indice = 0;
            this.sincronizar(0);

        });

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue() ?? "1",
            "idEvaluador": SelvaApplication.user.payload.CEDULA ?? "0",
            "idEvaluado": this.selectorEvaluados.getValue() ?? "0",
        }

        KMessage("servidor", payload, this.CARGAR_COMPETENCIAS)
            .send(this.server)
            .then(data => {
                this.competencias = JSON.parse(data);
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("servidor", payload, this.CARGAR_EVALUACIONES)
            .send(this.server)
            .then(data => {

                this.evaluaciones = JSON.parse(data);
                steps.next();

            })
            .catch(err => {
                console.log(err);
            })


    }


    loadData2() {

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue() ?? "1",
            "idEvaluador": SelvaApplication.user.payload.CEDULA ?? "0"
        };

        KMessage("servidor", payload, this.CARGAR_EVALUADOS)
            .send(this.server)
            .then(data => {

                if (data == "[]") {
                    alert("No hay evaluados asignados para este periodo.");
                    this.navigationController.back();
                    return;
                }

                this.selectorEvaluados.clear();
                this.evaluados.clear();
                this.evaluados.addOptions(JSON.parse(data));
                this.selectorEvaluados.importDataList(this.evaluados);
                this.loadData3();

            })
            .catch(err => { console.log(err); });

    }

    loadData() {
        this.indice = 0;
        this.botones.length = 0;
        this.navigationController.navigateTo(this.getInitScreen());

        KMessage("servidor", {}, "CARGAR_PERIODOS")
            .send(this.server)
            .then((data) => {
                debugger;
                this.periodos.clear();
                this.periodos.addOptions(JSON.parse(data));
                this.selectorPeriodo.importDataList(this.periodos);
                this.loadData2();
            })
            .catch(err => {
                console.log(err);
            });




    }

    constructor(name = "evaluacion360", launcherInfoWrapper = new KLauncherInfoClass("Evaluacion 360", 0, "system", true, "360a.png")) {
        super(name, launcherInfoWrapper);
    }
}

new Evaluacion360().register();