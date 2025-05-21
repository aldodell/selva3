class AdministrarCompetenciasPorCargo extends SelvaApplication {


    guardar(payload) {
        if (confirm("¿Desea guardar la competencia?")) {

            KMessage("servidor", payload, "ACTUALIZAR_COMPETENCIA_POR_CARGO")
                .send(this.server)
                .then((r) => {
                    alert(`Guardado ${r}`);
                })
                .catch(err => { alert(err.message) });
        }
    }

    eliminar(payload) {
        if (confirm("¿Desea eliminar la competencia?")) {
            
            KMessage("servidor", payload, "ELIMINAR_COMPETENCIA_POR_CARGO")
                .send(this.server)
                .then((r) => {
                    if (r == "OK") {
                        this.loadData(false);
                    }
                })
                .catch(err => { alert(err.message) });
        }
    }

    nuevo() {
        // this.initScreen.clear();
        KMessage("servidor", {}, "NUEVA_COMPETENCIA_POR_CARGO")
            .send(this.server)
            .then((r) => {

                if (r == "OK") {
                    this.loadData(false);
                }

            })
            .catch(err => { alert(err.message) });
    }


    getInitScreen() {

        let initScreen = super.getInitScreen();

        //Limpiamos todo si hay algo:
        initScreen.body.clear();

        initScreen.add(

            KDataView(
                (dataView, row) => {
                    return KColumn(
                        KHidden(row.id, "id"),
                        KRow(
                            KLabel("CARGO").setSize(210),
                            KLabel("COMPETENCIA").setSize(404),
                            KLabel("TIPO").setSize(196),
                            KLabel("GRADO"),
                        ).addCssTextOnChildren("font-weight: bold;"),
                        KDiv(
                            KText(row.CARGO, "CARGO").setSize(200),
                            KText(row.COMPETENCIA, "COMPETENCIA").setSize(400),
                            KText(row.TIPO_COMPETENCIA, "TIPO_COMPETENCIA").setSize(180),
                            KText(row.GRADO, "GRADO").setSize(60),
                        )
                            .addCssText("display: block; vertical-align: top;")
                            .addCssTextOnChildren("display: inline-block;vertical-align: top;")
                        ,
                        KLabel("DESCRIPCION").addCssText("font-weight: bold;"),
                        KTextArea(row.DESCRIPCION, "DESCRIPCION")
                            .setSize(864, 100),

                        KRow(
                            KButton("💾")
                                .addEvent("click", (e) => {
                                    let payload = row.ui.getData();
                                    this.guardar(payload);
                                })
                            ,
                            KButton("🗑️").addEvent("click", (e) => {
                                let payload = row.ui.getData();
                                this.eliminar(payload);
                            }),
                            KButton("✍️️️️").addEvent("click", (e) => {

                                this.nuevo();
                            })

                        ).addCssTextOnChildren("font-size:1.5em;margin-right: 16px;")
                    )
                        .addCssText("margin-bottom: 48px; margin-left: 8px; margin-top: 8px;")
                        .getMe((me) => row.ui = me)

                },
                this.data
            )
                .addCssText("overflow-y: scroll;")
        )


        this.initScreen = initScreen;

        return this.initScreen;
    }




    loadData(firstTime = true) {
        KMessage("servidor", {}, "CARGAR_COMPETENCIAS_POR_CARGO")
            .send(this.server)
            .then((data) => {
                this.data = JSON.parse(data);
                if (firstTime) {
                    this.navigationController.navigateTo(this.getInitScreen());
                } else {
                    this.navigationController.replace(this.getInitScreen());
                }

            })
            .catch(err => {
                console.log(err);
            });
    }


    run() {
        this.loadData();
    }


    constructor() {
        super("administrarCompetenciasPorCargo",
            new KLauncherInfoClass("Administrar competencias por cargo", 0, "system", true)
        );
    }
}

new AdministrarCompetenciasPorCargo().register();