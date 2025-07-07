class Reporte360Comite extends ReporteSelva {

    tituloPrincipal = "360 COMITE";

    configureReport() {

        this.getReport()
            .add(

                KRow(
                    KLabel("PROMEDIO COMITE")
                ),
                //bambina.
                KColumn(
                    KRow(
                        KLabel("PERSONA").setSize(350),
                        KLabel("DEPARTAMENTO").setSize(300),
                        KLabel("PROMEDIO").setSize(100),

                    ).addCssText("background-color:navy; color: white; font-weight: bold;")
                    ,

                    KDataView()
                        .getMe(me => this.tabla1 = me)
                        .addEvenRowCssText("background-color: lightgray;")
                        .setCallbackBuilder((dv, row) => {
                            row["promedio"] = Math.round(parseFloat(row["promedio"]));
                            return KRow(
                                KLabel("", "NOMBRES_APELLIDOS").setSize(350),
                                KLabel("", "DEPARTAMENTO").setSize(300),
                                KLabel("", "promedio").setSize(100).addCssText("text-align: center;"),

                            )
                        }),
                ).addCssText("border: 1px solid gray;  width: 792px; margin-top:8px;padding:4px; border-radius: 4px;")

                ,

                KRow(
                    KVerticalBarGraph("Evaluadores")
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 400)
                        .getMe(me => this.grafico1 = me)
                        .setBarWidth(100)
                ).setSize(800, 400)
                ,


                KRow(
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
        KMessage("servidor", payload, "CARGAR_EVALUADORES_360_COMITE", payload)
            .send(this.server)
            .then((data) => {



                data = JSON.parse(data);

                this.tabla1.setArrayData(data);

                let promedioAutoevaluacion = data.reduce((a, b) => a + parseFloat(b.autoevaluacion), 0) / data.length;
                let promedioJefe = data.reduce((a, b) => a + parseFloat(b.jefe), 0) / data.length;
                let promedioPares = data.reduce((a, b) => a + parseFloat(b.pares), 0) / data.length;
                let promedioColaboradores = data.reduce((a, b) => a + parseFloat(b.colaboradores), 0) / data.length;


                this.grafico1.addBar(promedioAutoevaluacion, "promedio", "Autoevaluacion", this.getColorByValue(promedioAutoevaluacion))
                this.grafico1.addBar(promedioJefe, "promedio", "Jefe", this.getColorByValue(promedioJefe))
                this.grafico1.addBar(promedioPares, "promedio", "Pares", this.getColorByValue(promedioPares))
                this.grafico1.addBar(promedioColaboradores, "promedio", "Colaboradores", this.getColorByValue(promedioColaboradores))
                this.grafico1.render();


            });



    }


    loadData() {
        super.loadData(() => this.loadData2());
        this.getReport();

    }
    constructor() {
        super("reporte360Comite",
            new KLauncherInfoClass("Reporte 360 comité", 0, "system", true, "360.png"));
    }
}

new Reporte360Comite().register();




/**
 * 
 * 
                // <---- Tabla general --->
                //encabezado de la tabla
                KRow(
                    KLabel("Competencia").addCssText("flex-basis: 300px;"),
                    KCheckbox(0, "cb_auto").addCssText("flex-basis: 20px;").addEvent("change", () => this.cargarEvaluado()),
                    KLabel("Auto.").addCssText("flex-basis: 80px;"),
                    KCheckbox(0, "cb_jefe").addCssText("flex-basis: 20px;").addEvent("change", () => this.cargarEvaluado()),
                    KLabel("Jefe").addCssText("flex-basis: 80px;"),
                    KCheckbox(0, "cb_pares").addCssText("flex-basis: 20px;").addEvent("change", () => this.cargarEvaluado()),
                    KLabel("Pares").addCssText("flex-basis: 80px;"),
                    KCheckbox(0, "cb_colaboradores").addCssText("flex-basis: 20px;").addEvent("change", () => this.cargarEvaluado()),
                    KLabel("Colab.").addCssText("flex-basis: 80px;"),
                    KLabel("Prom.").addCssText("flex-basis: 100px;"),
                )
                    .getMe(me => this.encabezado = me)
                    .setData(this.evaluadores)
                    .addCssText("background-color:navy; color: white; font-weight: bold;"),
                KDataView().setCallbackBuilder
                    ((parent, item) => {
                        return KRow(
                            KLabel(item.competencia).addCssText("flex-basis: 330px;"),
                            KLabel(item.autoevaluacion).addCssText("flex-basis: 100px;"),
                            KLabel(item.jefe).addCssText("flex-basis: 100px;"),
                            KLabel(item.pares).addCssText("flex-basis: 100px;"),
                            KLabel(item.colaboradores).addCssText("flex-basis: 100px;"),
                            KLabel(item.promedio).addCssText("flex-basis: 80px;"),
                        )
                    })

            ).getMe((me) => this.dataView0 = me)
            ,

            // <---- Grafico de barras --->
            KVerticalBarGraph("Promedio por evaluador")
                .getMe(me => this.grafico1 = me)
                .setSize("800px", "200px")
                .addReferenceValues(50, 60, 70, 80, 90, 100)
                .addCssText("top:350px;")
                .addBar(0, "autoevaluacion", "Auto.", "background-color: beige;")
                .addBar(0, "jefe", "Jefe", "background-color: gold")
                .addBar(0, "pares", "Pares", "background-color: coral")
                .addBar(0, "colaboradores", "Colab.", "background-color: pink;")
                .setConfigureBarByValue((bar, value) => {
                    let css = this.getColorByValue(value);
                    bar.addCssText(css);
                })
            ,


 */