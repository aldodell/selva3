class ReporteCargoCompania extends ReporteSelva {
    tituloPrincipal = "COMPETENCIAS POR CARGO POR EMPRESAS";


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

        debugger;
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            //"cargo": this.selectorCargo.getValue()
        }

        KMessage("servidor", payload, "CARGAR_EVALUACION_POR_CARGO_PROMEDIO_EMPRESAS", payload)
            .send(this.server)
            .then((data) => {

                debugger;

                data = JSON.parse(data);

                let promedioVenezuela = Math.round(data.reduce((a, b) => a + parseFloat(b.calificacion), 0) / data.length);
                this.promedioVenezuelaLabel.clear().setValue(promedioVenezuela);
                this.grafico1.init();
                data.forEach(e => {
                    this.grafico1.addBar(e.calificacion, "", e.COMPANIA, this.getColorByValue(e.calificacion));
                })
                this.grafico1.render(); 

            });



    }


    loadData() {
        super.loadData(() => this.loadData2());
    }

    constructor() {
        super("reporteCargoCompanias",
            new KLauncherInfoClass("Competencias por cargo: Empresas", 0, "system", true, "competencias_reporte.png"));
    }
}

new ReporteCargoCompania().register();