class Reporte360Companias extends ReporteSelva {

    configured = false;
     tituloPrincipal = "Desempeño 360 por empresas";

    configureReport() {

        debugger;
        if (this.configured) return;
        this.configured = true;

        this.selectorPeriodo.addEvent("change", () => {
            this.loadData2();
        });


        this.getReport().add(
            KColumn(
                KRow(
                    KLabel(this.promedioTotal).addCssText("font-weight: bold;")
                        .getMe((me) => this.promedioTotalLabel = me)
                ).center()
                    .addCssText("margin-top:8px;padding:4px; border: 1px solid gray; width: 792px;"),


                KRow(
                    KVerticalBarGraph("Promedios por empresa")
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 200)
                        .getMe(me => this.grafico1 = me)
                        .setConfigureBarByValue((bar, value) => {
                            let css = this.getColorByValue(value);
                            bar.addCssText(css);
                        })
                        .addBarCaptionCssText("font-size: 0.8em; font-weight: bold;")
                        .setTitle(
                            KRow(
                                KLabel("Promedios por empresa", "title")
                                    .addCssText("font-size: 1.2em; font-weight: bold;")
                            )
                                .addCssText("height: 40px;")
                                .addCssText("background-color: navy; color:white; padding-bottom: 5px;")

                        )
                ).setSize(800, 200)
                ,


                // Tabla de evaluadores
                KColumn(
                    KRow(
                        KLabel("Compañía").setSize(180),
                        KLabel("Autoevaluacion").setSize(60).addCssText("text-align: center;"),
                        KLabel("Jefe").setSize(60).addCssText("text-align: center;"),
                        KLabel("Pares").setSize(60).addCssText("text-align: center;"),
                        KLabel("Colaboradores").setSize(60).addCssText("text-align: center;"),
                        KLabel("Promedio").setSize(70).addCssText("text-align: center;")

                    ).addCssText("width:794px;justify-content: space-between;")
                        .addCssText("background-color: navy; color:white; padding:0px;")

                    ,

                    KDataView()
                        .getMe((me) => this.tablaEvaluadores = me)
                        .setCallbackBuilder(
                            (dataView, row) => {
                                let r = KRow(
                                    KLabel("", "COMPANIA").setSize(180).addCssText("text-align: left;"),
                                    KLabel("", "autoevaluacion").setSize(60).addCssText("text-align: center;"),
                                    KLabel("", "jefe").setSize(60).addCssText("text-align: center;"),
                                    KLabel("", "pares").setSize(60).addCssText("text-align: center;"),
                                    KLabel("", "colaboradores").setSize(60).addCssText("text-align: center;"),
                                    KLabel("", "promedio").setSize(60).addCssText("text-align: center;")
                                ).addCssText("justify-content: space-between;")
                                return r;
                            }
                        )
                        .addEvenRowCssText("background-color: lightgray;")

                ).addCssText("margin-top:8px;padding:4px; border: 1px solid gray; width: 792px;")

            ),

            //Tabla por competencias
            KColumn(
                KRow(
                    //Titulo
                    KDataView()
                        .getMe((me) => this.encabezadoCompetencias = me)
                        .setCallbackBuilder((dataView, data) => {
                            let r = KRow(
                                KLabel("Compañia").setSize(100)
                            )

                            for (let i = 0; i < data.length; i++) {
                                r.add(
                                    KLabel(data[i].COMPETENCIA)
                                        .setSize(88)
                                        .addCssText("font-size: 0.7em;")
                                        //.addCssText("border-right: 1px solid gray;")
                                        .addCssText("padding:2px;")
                                );
                            }

                            r.addCssText("background-color: navy; color:white; padding:0px;");


                            return r;
                        }),
                ),
                KRow(
                    //Cuerpo
                    KDataView()
                        .getMe((me) => this.cuerpoCompetencias = me)
                        .setCallbackBuilder((dataView, data) => {
                            let r = KRow();
                            for (let i = 0; i < data.length; i++) {

                                r.add(
                                    KLabel(data[i])
                                        .setSize(88)
                                        .addCssText("font-size: 0.7em;")
                                        .addCssText("text-align: center;")
                                );
                            }

                            return r;
                        })
                ),


            ).addCssText("margin-top:8px;padding:4px; border: 1px solid gray; width: 792px;")
            , KRow(
                KImage("media/escala.png")
                    .setSize(300, 129)
                    .addCssText("margin-top:8px;")
                // .setPosition(75, 560)
            ).setSize(300, 129)
        )

    }

    loadData2() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue()
        }


        //Obtenemos los valores de todas las empresas
        KMessage("servidor", payload, "CARGAR_EVALUACIONES_360_POR_COMPANIAS_Y_EVALUADORES", payload)
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);
                this.promedioTotal = data.reduce((a, b) => a + parseFloat(b.promedio), 0) / data.length;
                this.promedioTotalLabel.clear().setValue(`Promedio total en Venezuela: ${this.promedioTotal}`);

                this.grafico1.init();
                data.forEach(compania => {
                    this.grafico1.addBar(Math.round(compania.promedio), compania.promedio, compania.COMPANIA, compania.COMPANIA);
                })

                this.grafico1.render();
                this.tablaEvaluadores.setArrayData(data);

            });


        KMessage("servidor", payload, "CARGAR_360_POR_COMPANIAS_Y_COMPETENCIAS", payload)
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);
                console.log(data);
                let competencias = data.competencias;//.map(comp => comp.COMPETENCIA)
                this.encabezadoCompetencias.buildByData(competencias);

                this.cuerpoCompetencias.clear().setArrayData(data.arrayData);
            });
    }


    loadData() {
        super.loadData(() => this.loadData2());
        this.getReport();

    }
    constructor() {
        super("reporte360Companias",
            new KLauncherInfoClass("360 Empresas", 0, "system", true,"360r.png"));
    }
}

new Reporte360Companias().register();