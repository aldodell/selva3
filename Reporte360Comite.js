class Reporte360Comite extends ReporteSelva {


    tituloPrincipal = "Desempeño 360 por empresas";

    configureReport() {


        this.getReport()
            .add(

                KRow(
                    KLabel("PROMEDIO COMITE")
                ),

                KRow(
                    KLabel("PERSONA"),
                    KLabel("DEPARTAMENTO"),
                    KLabel("PROMEDIO"),
                    KLabel("CRITERIO")
                ),

                KDataView()
                    .getMe(me => this.tabla1 = me)
                    .setCallbackBuilder((dv, row) => {
                        KLabel("", "PERSONA"),
                            KLabel("", "DEPARTAMENTO"),
                            KLabel("", "PROMEDIO"),
                            KLabel("", "CRITERIO")
                    }),


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


            KRow(
                KImage("media/escala.png")
                    .setSize(300, 129)
                    .addCssText("margin-top:8px;")
                // .setPosition(75, 560)
            ).setSize(300, 129)



    }

    loadData2() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue()
        }


        //Obtenemos los valores de todas las empresas
        KMessage("servidor", payload, "CARGAR_EVALUADORES_360_COMITE", payload)
            .send(this.server)
            .then((data) => {

                debugger;

                data = JSON.parse(data);

                //this.promedioTotal = data.reduce((a, b) => a + parseFloat(b.promedio), 0) / data.length;
                // this.promedioTotalLabel.clear().setValue(`Promedio total en Venezuela: ${this.promedioTotal}`);

                this.grafico1.init();
                data.forEach(persona => {
                    this.grafico1.addBar();
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
        super("reporte360Comite",
            new KLauncherInfoClass("Reporte 360 comité", 0, "system", true, "360.png"));
    }
}

new Reporte360Comite().register();