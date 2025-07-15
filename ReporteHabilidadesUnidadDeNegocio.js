class ReporteHabilidadesUnidadDeNegocio extends ReporteSelva {
    tituloPrincipal = "HABILIDADES TECNICAS POR UNIDAD DE NEGOCIO";



    configureReport() {
        this.getReport()
            .add(

                KRow(
                    KLabel("PROMEDIO VENEZUELA:")
                        .getMe(me => this.promedioVenezuelaLabel = me)
                        .applySimpleRoundedBorder()
                        .addCssText("margin-right: 4px; background-color: navy; color: white;font-weight: bold; padding: 4px;")
                        .setSize(796)
                    ,
                ),

                KRow(
                    KHorizontalBarGraph("HABILIDADES TECNICAS POR UNIDAD DE NEGOCIO")
                        .setSize(800, 400)
                        .setLegendWidth(500)
                        .addReferenceValues(50, 60, 70, 80, 90, 100)
                        .getMe(me => this.grafico1 = me)
                ).setSize(800, 400),
                KRow(
                    KImage("media/escala.png")
                        .setSize(300, 129)

                )
                    .setSize(300, 129)
                    .addCssText("margin-top: 8px;")

            )
    }


    loadData2() {

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue()
        }
        //
        KMessage("servidor", payload, "CARGAR_HABILIDADES_TECNICAS_POR_UNIDAD_DE_NEGOCIO_PROMEDIOS")
            .send(this.server)
            .then((data) => {
                debugger;
                data = JSON.parse(data);
                this.grafico1.init();
                data.forEach(e => {
                    this.grafico1.addBar(e.calificacion, "", e.unidadNegocio, this.getColorByValue(e.calificacion))
                })
                this.grafico1.render();

            });



        //CARGAR_HABILIDADES_TECNICAS_PROMEDIO_TOTAL

        KMessage("servidor", payload, "CARGAR_HABILIDADES_TECNICAS_PROMEDIO_TOTAL")
            .send(this.server)
            .then((data) => {
                debugger;
                data = JSON.parse(data);
                let promedioVenezuela = data[0].calificacion;
                this.promedioVenezuelaLabel.setValue(`PROMEDIO VENEZUELA: ${promedioVenezuela}`);

            });


    }


    loadData() {
        super.loadData(() => this.loadData2());
    }



    constructor() {
        super("reporteHabilidadesUnidadDeNegocio",
            new KLauncherInfoClass("Habilidades técnicas: Unidad de Negocio", 0, "system", true, "habilidades_reporte.png"));
    }
}


//CARGAR_HABILIDADES_TECNICAS_POR_UNIDAD_DE_NEGOCIO_PROMEDIOS

new ReporteHabilidadesUnidadDeNegocio().register();