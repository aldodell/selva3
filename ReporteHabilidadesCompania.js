class ReporteHabilidadesCompania extends ReporteSelva {

    tituloPrincipal = "HABILIDADES TECNICAS";

    configureReport() {
        this.getReport()
            .add(
                KRow(
                    KLabel("PROMEDIO NACIONAL")
                        .getMe(me => this.promedioNacional = me)
                ).addCssText("border: 1px solid black; font-weight: bold; width: 792px; padding: 4px; background-color: navy; color: white;")

                ,
                KRow(
                    KVerticalBarGraph("HABILIDADES TECNICAS POR EMPRESAS")
                        .addReferenceValues(0, 25, 50, 75, 100)
                        .getMe(me => this.grafico1 = me)
                        .setSize(800, 400)
                        .setLegendHeight(60)
                )
                    .setSize(800, 400),
                KRow(
                    KDataView()
                        .getMe(me => this.encabezado1 = me)
                        .setCallbackBuilder((dv, row) => {
                            debugger;
                            let krow = KRow()
                                .addCssText("background-color: navy; color: white; font-weight: bold;")
                                .addCssText("font-size: 0.8em; padding: 4px;");
                            krow.add(KLabel("EMPRESA").setSize(200));
                            for (let i = 0; i < 4; i++) {
                                krow.add(KLabel(row[i]).setSize(160));
                            }
                            return krow;
                        })


                ),
                KRow(
                    KDataView()
                        .addEvenRowCssText("background-color: lightgray;")
                        .getMe(me => this.tabla1 = me)
                        .setCallbackBuilder((dv, row) => {
                            return KRow(
                                KLabel(row.empresa).setSize(200)
                            ).getMe(krow => {
                                for (let i = 0; i < 4; i++) {
                                    krow.add(
                                        KLabel(row.calificaciones[i])
                                            .setSize(160)
                                            .addCssText("text-align: center;")
                                    );
                                }
                            });
                        })
                )
            )
    }


    loadData2() {
        //CARGAR_HABILIDADES_TECNICAS_POR_EMPRESA

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            // "idEvaluador": idEvaluador,
            // "idEvaluado": this.selectorTrabajador.getValue()
        }

        KMessage("servidor", payload, "CARGAR_HABILIDADES_TECNICAS_POR_EMPRESA", payload)
            .send(this.server)
            .then((data) => {
                data = JSON.parse(data);
                let promedioNacional = 0;
                this.grafico1.init();
                data.forEach(e => {
                    this.grafico1.addBar(e.promedio, "", e.empresa, this.getColorByValue(e.promedio));
                    promedioNacional += parseFloat(e.promedio);
                })
                promedioNacional /= data.length;
                this.promedioNacional.setValue("PROMEDIO TOTAL EN VENEZUELA: " + promedioNacional);
                this.grafico1.render();
            });

        //

        KMessage("servidor", payload, "CARGAR_PROMEDIO_HABILIDADES_TECNICAS_POR_EMPRESA_Y_HABILIDAD", payload)
            .send(this.server)
            .then((data) => {
                debugger;
                data = JSON.parse(data);
                this.encabezado1.buildByData(data.habilidades);
                this.tabla1.setArrayData(data.datos);
            });

    }


    loadData() {
        super.loadData(() => this.loadData2());
    }

    constructor() {
        super("reporteHabilidadesCompania",
            new KLauncherInfoClass("Habilidades técnicas por Compañía", 0, "system", true, "habilidades_reporte.png", 32));
    }
}

new ReporteHabilidadesCompania().register();