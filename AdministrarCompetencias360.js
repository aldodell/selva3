class AdministrarCompetencias360 extends SelvaApplication {

    competencias = [];
    competenciasCambiadas = [];
    comportamientosCambiados = [];



    guardarCompetencia(payload) {

        if (confirm("¿Desea guardar la competencia?")) {
            if (payload.nueva != undefined && payload.nueva != payload.anterior) {
                KMessage("servidor", payload, "ACTUALIZAR_COMPETENCIA_360")
                    .send(this.server)
                    .then(response => { if (response == "OK") alert("Competencia guardada"); });
            } else {
                alert("Error al guardar la competencia");
            }
        }



    }


    guardarComportamiento(payload) {

        if (confirm("¿Desea guardar el comportamiento?")) {
            if (payload.nuevo != undefined) {
                KMessage("servidor", payload, "ACTUALIZAR_COMPORTAMIENTO_360")
                    .send(this.server)
                    .then(response => { if (response == "OK") alert("Comportamiento guardado"); });
            } else {
                alert("Error al guardar el comportamiento");
            }
        }

    }

    getInitScreen() {

        let initScreen = super.getInitScreen();

        //Limpiamos todo si hay algo:
        initScreen.body.clear();

        let indexCompetencia = 0;

        for (let competencia of this.competencias) {
            initScreen.add(
                KRow(
                    KText(competencia, "COMPETENCIA")
                        .setSize("fit-content")
                        .addCssText("flex-basis: 680px;margin-bottom: 8px; margin-left: 8px;")
                        .addCssText("font-weight: bold; font-size: 1.5em;")
                        .getMe((me) => me.indexCompetencia = indexCompetencia)
                        .addEvent("change", (e) => {
                            let me = e.target.self;
                            let i = me.indexCompetencia;
                            this.competenciasCambiadas[i] = e.target.value;
                        })
                    ,
                    //KHidden(indexCompetencia),
                    KRow(
                        KButton("💾")
                            .addEvent("click", (e) => {
                                let me = e.target.self;
                                let i = me.indexCompetencia;
                                let payload = { "anterior": this.competencias[i], "nueva": this.competenciasCambiadas[i] };
                                this.guardarCompetencia(payload);
                            })
                            .getMe((me) => me.indexCompetencia = indexCompetencia)
                            .addCssText("vertical-align: top; font-size:1.5em; margin-left: 8px;margin-bottom: 8px;")
                    ).setTitle(
                        "Guardar Competencia"
                    )

                )

            )

            //📄

            for (let row of this.data.filter(x => x.COMPETENCIA == competencia)) {
                initScreen.add(
                    KRow(
                        KTextArea(row.COMPORTAMIENTO, "COMPORTAMIENTO")
                            .addCssText("margin-left: 50px;")
                            .setSize(640, 100)
                            .getMe((me) => { me.idComportamiento = row.id })
                            .addEvent("change", (e) => {
                                let me = e.target.self;
                                let i = me.idComportamiento;
                                this.comportamientosCambiados[i] = e.target.value;

                            }),
                        KDiv(
                            KButton("💾")
                                .getMe((me) => me.idComportamiento = row.id)
                                .addEvent("click", (e) => {

                                    let me = e.target.self;
                                    let payload = {
                                        "id": me.idComportamiento,
                                        "nuevo": this.comportamientosCambiados[me.idComportamiento]
                                    };

                                    this.guardarComportamiento(payload);


                                })
                                .addCssText("vertical-align: top; font-size:1.5em; margin-left: 8px;")
                        )
                            .addCssText("display:inline-block; vertical-align: top;")
                            .setTitle(
                                "Guardar Comportamiento"
                            )

                    ).addCssText("display:inline-block; vertical-align: top;")
                )
            }


            initScreen.add(
                KRow(
                    KButton("📄")
                        .addEvent("click", () => {
                        })

                        .addCssText("margin-left: 50px; font-size:1.5em;")
                )
                    .addCssText("width: fit-content;margin-bottom:100px;")
                    .setTitle(
                        "Nuevo comportamiento"
                    )

            )

            indexCompetencia++;
        }


        //Vamos recorriendo por cada competencia
        //console.log("this.data", this.data);

        return initScreen;

    }


    loadData() {
        KMessage("servidor", {}, "CARGAR_COMPETENCIAS_360")
            .send(this.server)
            .then(data => {
                this.data = JSON.parse(data);

                this.competencias = this.data.reduce((acc, value) => {
                    if (!acc.includes(value.COMPETENCIA)) acc.push(value.COMPETENCIA);
                    return acc;
                }, []);


                //Navega a la pantalla inicial
                this.navigationController.navigateTo(this.getInitScreen());
            })
            .catch(err => { console.log(err); });

    }

    constructor() {
        super("administrarCompetencias360",
            new KLauncherInfoClass("Administrar Competencias 360", 0, "system", true, "adm_360.png", 32));
    }
}

new AdministrarCompetencias360().register();