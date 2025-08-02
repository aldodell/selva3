class EvaluacionPorObjetivos extends SelvaApplication {

    periodos = KDataList();
    evaluados = KDataList();
    calificaciones = KDataList()
        .addOption("Sobresaliente", 4)
        .addOption("Satisfactorio", 3)
        .addOption("Regular", 2)
        .addOption("No satisfactorio", 1)
    indice = 0;
    selectorPeriodo = KSelect(this.periodos, "idPeriodo")
    selectorEvaluados = KSelect(this.evaluados, "idEvaluado")
    evaluacion = [];

    CARGAR_EVALUADOS = "CARGAR_EVALUADOS_POR_OBJETIVOS";
    CARGAR_EVALUACION = "CARGAR_EVALUACIONES_POR_OBJETIVOS";
    GUARDAR_ITEM_EVALUACION = "GUARDAR_ITEM_EVALUACION_POR_OBJETIVOS";
    initScreen;

    ponderaciones = [];
    mensajeros = [];



    getInitScreen() {

        if (this.initScreen != undefined) {
            return this.initScreen;
        }

        this.initScreen = super.getInitScreen();
        this.initScreen.add(

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
                //Objetivo 1
                KColumn(
                    KLabel("Objetivo 1"),
                    KTextArea("", "objetivo1", "Objetivo 1"),
                    KRow(
                        KLabel("Ponderación: "),
                        KText("", "ponderacion1")
                            .setSize(40)
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => this.ponderaciones.push(me))
                            .addEvent("change", () => this.validarPonderacion())
                        ,
                        KLabel("", "mensaje")
                            .addCssText("margin-left: 8px; visibility: hidden; color: red;")
                            .getMe((me) => this.mensajeros.push(me))
                        ,
                        KLabel("Calificación: ").addCssText("margin-left: 8px;"),
                        KSelect(this.calificaciones, "calificacion1")
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => me.ponderacion1 = me)
                    )
                )
                    .addCssText("margin: 8px;")
                    .applySimpleRoundedBorder(),
                //Objetivo 2
                KColumn(
                    KLabel("Objetivo 2"),
                    KTextArea("", "objetivo2", "Objetivo 2"),
                    KRow(
                        KLabel("Ponderación: "),
                        KText("", "ponderacion2")
                            .setSize(40)
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => this.ponderaciones.push(me))
                            .addEvent("change", () => this.validarPonderacion())
                        ,
                        KLabel("", "mensaje")
                            .addCssText("margin-left: 8px; visibility: hidden; color: red;")
                            .getMe((me) => this.mensajeros.push(me))
                        ,
                        KLabel("Calificación: ").addCssText("margin-left: 8px;"),
                        KSelect(this.calificaciones, "calificacion2")
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => me.ponderacion2 = me)
                    )
                )
                    .addCssText("margin: 8px;")
                    .applySimpleRoundedBorder(),

                //Objetivo 3
                KColumn(
                    KLabel("Objetivo 3"),
                    KTextArea("", "objetivo3", "Objetivo 3"),
                    KRow(
                        KLabel("Ponderación: "),
                        KText("", "ponderacion3")
                            .setSize(40)
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => this.ponderaciones.push(me))
                            .addEvent("change", () => this.validarPonderacion())
                        ,
                        KLabel("", "mensaje")
                            .addCssText("margin-left: 8px; visibility: hidden; color: red;")
                            .getMe((me) => this.mensajeros.push(me))
                        ,
                        KLabel("Calificación: ").addCssText("margin-left: 8px;"),
                        KSelect(this.calificaciones, "calificacion3")
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => me.ponderacion3 = me)
                    )
                )
                    .addCssText("margin: 8px;")
                    .applySimpleRoundedBorder(),

                //Objetivo 4
                KColumn(
                    KLabel("Objetivo 4"),
                    KTextArea("", "objetivo4", "Objetivo 4"),
                    KRow(
                        KLabel("Ponderación: "),
                        KText("", "ponderacion4")
                            .setSize(40)
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => this.ponderaciones.push(me))
                            .addEvent("change", () => this.validarPonderacion())
                        ,
                        KLabel("", "mensaje")
                            .addCssText("margin-left: 8px; visibility: hidden; color: red;")
                            .getMe((me) => this.mensajeros.push(me))
                        ,
                        KLabel("Calificación: ").addCssText("margin-left: 8px;"),
                        KSelect(this.calificaciones, "calificacion4")
                            .addCssText("margin-left: 8px;")
                            .getMe((me) => me.ponderacion4 = me)
                    )
                )
                    .addCssText("margin: 8px;")
                    .applySimpleRoundedBorder(),

                KRow(
                    KLabel("Total ponderación: ")
                        .addCssText("margin-left: 8px;")
                        .getMe((me) => this.totalPonderacion = me)
                    ,

                    KButton("Guardar y salir")
                        .addEvent("click", () => {
                            this.guardar();
                        })
                        .getMe((me) => this.botonGuardar = me)
                        .disable()
                        .setSize("200px")
                )

            )
                .addCssTextOnChildren("padding: 8px; gap: 8px;")
                .setSize("100%", "100%")

        )
        return this.initScreen;
    }


    validarPonderacion() {
        let suma = 0;
        this.botonGuardar.disable();


        for (let i = 0; i < this.ponderaciones.length; i++) {
            let ponderacion = this.ponderaciones[i];
            let valor = parseInt(ponderacion.getValue());
            if (isNaN(valor)) { valor = 0 }
            suma += valor;

            if (valor > 50) {
                this.mensajeros[i].setValue("La ponderación debe ser menor o igual a 50");
                this.mensajeros[i].show();
            } else if (valor < 20) {
                this.mensajeros[i].setValue("La ponderación debe ser mayor o igual a 20");
                this.mensajeros[i].show();
            } else if (suma != 100) {
                this.mensajeros[i].setValue("La suma de todas las ponderaciones debe ser 100");
                this.mensajeros[i].show();
            } else {
                this.mensajeros.forEach(m => { m.hide(); m.setValue(""); });
                this.botonGuardar.enable();
            }
        }

        this.totalPonderacion.setValue(`Total ponderación: ${suma}`);
        return suma == 100;
    }



    guardar() {
        if (this.validarPonderacion()) {

            let payload = {
                idEvaluador: SelvaApplication.user.payload.CEDULA,
                idPeriodo: this.selectorPeriodo.getValue(),
                idEvaluado: this.selectorEvaluados.getValue(),
                id: this.recordId,
                fechaHora: new Date().toMySQL()
            }

            let data = this.getInitScreen().getData();
            Object.assign(payload, data);


            KMessage("servidor", payload, this.GUARDAR_ITEM_EVALUACION)
                .send(this.server)
                .then((data) => {

                    this.navigationController.back();

                })

        }

    }


    loadData3() {

        let payload = {
            idEvaluador: SelvaApplication.user.payload.CEDULA,
            idPeriodo: this.selectorPeriodo.getValue(),
            idEvaluado: this.selectorEvaluados.getValue()

        }
        KMessage("servidor", payload, this.CARGAR_EVALUACION)
            .send(this.server)
            .then((data) => {


                this.evaluacion = JSON.parse(data);
                if (this.evaluacion.length == 1) {
                    ;
                    console.log("evaluacion", this.evaluacion);
                    //Solo el primer y unico registro
                    this.evaluacion = this.evaluacion[0];
                    this.getInitScreen().setData(this.evaluacion);
                    this.validarPonderacion();
                }


            })
            .catch(err => {
                console.log(err);
            });


    }


    loadData2() {
        let payload = {
            idEvaluador: SelvaApplication.user.payload.CEDULA,
            idPeriodo: this.selectorPeriodo.getValue()
        }
        KMessage("servidor", payload, this.CARGAR_EVALUADOS)
            .send(this.server)
            .then((data) => {


                this.evaluados.clear();
                this.selectorEvaluados.clear();
                this.evaluados.addOptions(JSON.parse(data));
                this.selectorEvaluados.importDataList(this.evaluados);
                this.loadData3();


            })
            .catch(err => {
                console.log(err);
            });
    }


    loadData() {

        KMessage("servidor", {}, "CARGAR_PERIODOS")
            .send(this.server)
            .then((data) => {

                this.periodos.clear();
                this.periodos.addOptions(JSON.parse(data));
                this.selectorPeriodo.importDataList(this.periodos);
                this.loadData2();
            })
            .catch(err => {
                console.log(err);
            });



    }

    run() {
        this.navigationController.navigateTo(this.getInitScreen());
        this.loadData();

    }

    constructor(name = "evaluacionPorObjetivos", launcherInfoWrapper = new KLauncherInfoClass("Evaluación por objetivos", 0, "system", true,"objetivos.png")) {
        super(name, launcherInfoWrapper);

    }
}

new EvaluacionPorObjetivos().register();