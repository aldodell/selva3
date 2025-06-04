class Reporte360Personal extends ReporteSelva {

    tituloPrincipal = "Desempeño Personal 360";

    evaluados = KDataList();
    selectorEvaluados = KSelect();

    evaluadores = {
        cb_auto: 1,
        cb_jefe: 1,
        cb_pares: 1,
        cb_colaboradores: 1
    }

    promedioTotal = 0;

    configureReport() {
        this.getReport().add
            (

                KColumn(
                    // <---- Selector de Evaluados --->
                    KRow(
                        KLabel("Evaluado:")
                            .addCssText(this.titulo2)
                        ,
                        this.selectorEvaluados
                            .addEvent("change", () => this.cargarEvaluado())
                            .addCssText(this.titulo2s)
                        ,
                        KLabel(`Promedio total: ${this.promedioTotal}`)
                            .getMe((me) => this.promedioTotalLabel = me)
                            .addCssText("margin-right:4px;")
                    ).applySimpleRoundedBorder()
                        .addCssText("margin-bottom: 5px; justify-content: space-between;")

                    ,

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
                    KDataView(
                        (parent, item) => {
                            return KRow(
                                KLabel(item.competencia).addCssText("flex-basis: 330px;"),
                                KLabel(item.autoevaluacion).addCssText("flex-basis: 100px;"),
                                KLabel(item.jefe).addCssText("flex-basis: 100px;"),
                                KLabel(item.pares).addCssText("flex-basis: 100px;"),
                                KLabel(item.colaboradores).addCssText("flex-basis: 100px;"),
                                KLabel(item.promedio).addCssText("flex-basis: 80px;"),
                            );
                        }
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
                            if (value < 85) {
                                bar.addCssText("background-color: red;")
                            } else if (value >= 85 && value < 95) {
                                bar.addCssText("background-color: coral;")
                            } else if (value >= 95 && value < 100) {
                                bar.addCssText("background-color: green;")
                            } else {
                                bar.addCssText("background-color: gold;")
                            }

                        })
                    ,


                    KImage("media/escala.png")
                        .setSize(300, 129)
                        .setPosition(75, 560)

                )
            )
    }


    cargarEvaluado() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue() ?? 1,
            idEvaluador: SelvaApplication.user.payload.CEDULA,
            idEvaluado: this.selectorEvaluados.getValue()
        }

        KMessage("", payload, "CARGAR_EVALUACION_360_DE_UN_EVALUADO")
            .send(this.server)
            .then((data) => {


                data = JSON.parse(data);
                let data2 = [];
                let promedios = {
                    autoevaluacion: 0,
                    jefe: 0,
                    pares: 0,
                    colaboradores: 0
                };

                this.promedioTotal = 0;

                data.competencias.forEach(competencia => {
                    competencia = competencia.competencia;
                    let row = {};


                    row.autoevaluacion = data.autoevaluacion.find(e => e.competencia == competencia);
                    row.jefe = data.jefe.find(e => e.competencia == competencia);
                    row.pares = data.pares.find(e => e.competencia == competencia);
                    row.colaboradores = data.colaboradores.find(e => e.competencia == competencia);

                    row.autoevaluacion = row.autoevaluacion?.c ?? 0;
                    promedios.autoevaluacion += row.autoevaluacion;

                    row.jefe = row.jefe?.c ?? 0;
                    promedios.jefe += row.jefe;

                    row.colaboradores = row.colaboradores?.c ?? 0;
                    promedios.colaboradores += row.colaboradores;

                    row.pares = row.pares?.c ?? 0;
                    promedios.pares += row.pares;

                    row.competencia = competencia;


                    let q = this.encabezado.getData();
                    row.promedio = 0;
                    let divisor = 0;
                    if (q.cb_auto == "1") {
                        row.promedio += row.autoevaluacion;
                        divisor++;
                    }

                    if (q.cb_jefe == "1") {
                        row.promedio += row.jefe;
                        divisor++;
                    }

                    if (q.cb_pares == "1") {
                        row.promedio += row.pares;
                        divisor++;
                    }

                    if (q.cb_colaboradores == "1") {
                        row.promedio += row.colaboradores;
                        divisor++;
                    }

                    row.promedio = Math.ceil(row.promedio / divisor);

                    data2.push(row);

                    this.promedioTotal += row.promedio;


                })

                this.promedioTotal = Math.ceil(this.promedioTotal / data.competencias.length);
                this.promedioTotalLabel.setValue(`Promedio Total: ${this.promedioTotal}`);

                for (let p in promedios) {
                    promedios[p] = Math.ceil(promedios[p] / data.competencias.length);
                }

                this.grafico1.setData(promedios);

                this.dataView0.clear();
                this.dataView0.setArrayData(data2);


            });
    }

    cargarEvaluados() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue() ?? 1,
            idEvaluador: SelvaApplication.user.payload.CEDULA
        }

        KMessage("", payload, "CARGAR_EVALUADOS_360_ASIGNADOS_A_UN_EVALUADOR")
            .send(this.server)
            .then((data) => {

                this.evaluados.clear();
                this.selectorEvaluados.clear();
                this.evaluados.addOptions(JSON.parse(data));
                this.selectorEvaluados.importDataList(this.evaluados);

                this.cargarEvaluado();
            });
    }


    loadData() {
        super.loadData();
        this.cargarEvaluados();
    }

    constructor(name = "reporte360Personal", launcherInfoWrapper = new KLauncherInfoClass("Reporte 360 Personal", 0, "system", true)) {
        super(name, launcherInfoWrapper);
    }

}

new Reporte360Personal().register();