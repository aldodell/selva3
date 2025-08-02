class ReporteObjetivosPorEmpresas extends ReporteSelva {

    tituloPrincipal = "EVALUACION DE OBJETIVOS POR EMPRESAS";

    configureReport() {

        this.getReport()
            .add(
                KRow(
                    KLabel("PROMEDIO VENEZUELA:"),
                    KLabel("").getMe(me => this.promedioVenezuelaLabel = me).addCssText("margin-right: 4px;"),
                ).applySimpleRoundedBorder()
                    .setSize(800)
                ,

                KRow(
                    KVerticalBarGraph("EMPRESAS")
                        .setTitle(
                            KLabel("EVALUACION POR EMPRESA")
                                .addCssText("font-weight: bold;text-align: center;")
                        )
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 400)
                        .setLegendHeight(50)
                        .addBarCaptionCssText("text-align: center;")
                        .getMe(me => this.grafico1 = me)
                        .render()
                ).setSize(800, 400),
                KImage("media/escala.png")
                    .setSize(300, 129)
                    .addCssText("margin -top:4px;")

            )
    }


    loadData2() {


        ;
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            //"cargo": this.selectorCargo.getValue()
        }

        KMessage("servidor", payload, "CARGAR_PROMEDIO_POR_EMPRESA_EVALUACIONES_OBJETIVOS", payload)
            .send(this.server)
            .then((data) => {

                ;

                data = JSON.parse(data);

                let promedioVenezuela = Math.round(data.reduce((a, b) => a + parseFloat(b.promedio), 0) / data.length);
                this.promedioVenezuelaLabel.clear().setValue(promedioVenezuela);
                this.grafico1.init();
                data.forEach(e => {
                    let promedio = parseInt(e.promedio);
                    this.grafico1.addBar(promedio, "", e.empresa, this.getColorByValue(promedio));
                })
                this.grafico1.render();

            });


    }


    loadData() {
        super.loadData(() => this.loadData2());

    }

    constructor() {
        super("reporteObjetivosEmpresas",
            new KLauncherInfoClass("Objetivos por empresas", 0, "system", true, "objetivos_reporte.png", 32));
    }
}

new ReporteObjetivosPorEmpresas().register();