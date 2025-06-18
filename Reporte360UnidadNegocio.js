class Reporte360UnidadNegocio extends ReporteSelva {

    configured = false;
    tituloPrincipal = "Desempeño 360 por unidad de negocio";
    unidadesDeNegociosDataList = KDataList();
    //departamentosDataList = KDataList();
    competenciasArray = [];

    configureReport() {

        if (this.configured) return;
        this.configured = true;

        this.selectorPeriodo.addEvent("change", () => {
            this.loadData2();
        });

        this.getReport().add(
            KColumn(

                //Selector de la unidad de negocio
                KRow(
                    KLabel("Unidad de negocio").setSize(200),
                    KSelect(this.unidadesDeNegociosDataList, "unidadNegocio")
                        .getMe((me) => this.unidadesNegociosSelect = me)
                        .addEvent("change", () => { this.loadData3(); })
                        .setSize(600)
                ).center()
                    .addCssText("margin-top:8px;padding:4px; border: 1px solid gray; width: 792px;"),


                // ============== GRAFICO 1 ====================
                //Gráfico que muestra el promedio de cada departamento

                KRow(
                    KHorizontalBarGraph("Promedios por departamentos")
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 300)
                        .setLegendWidth(220)
                        .getMe(me => this.grafico1 = me)
                        .setConfigureBarByValue((bar, value) => {
                            let css = this.getColorByValue(value);
                            bar.addCssText(css);
                        })
                        .addBarCaptionCssText("font-size: 0.6em;")
                        .setTitle(
                            KRow(
                                KLabel("Promedios por departamentos", "title")
                                    .addCssText("font-size: 1.2em; font-weight: bold;")
                            )
                                .addCssText("height: 40px;")
                                .addCssText("background-color: navy; color:white; padding-bottom: 5px;")

                        )
                ).setSize(800, 300),



                // ============== TABLA 1 ====================
                // Tabla que muestra el promedio de cada competencia por departamento
                KColumn(

                    //construimos el encabezado de la tabla,
                    // que contendrá sólo con la palabra "DEPARTAMENTO" y luego las competencias

                    KRow(

                        KDataView()
                            .addEvenRowCssText("background-color: lightgray;")
                            .getMe((me) => this.tabla1Encabezado = me)
                            .setCallbackBuilder(
                                (dataView, row) => {

                                    let r2 = KRow();
                                    let r = KRow(
                                        KLabel("DEPARTAMENTO", "").setSize(120).addCssText("text-align: left; font-size: 0.7em;")
                                            .addCssText("background-color: navy; color:white; padding:0px;"),
                                        r2.setSize(680).addCssText(""),
                                    )

                                    for (let competencia of this.competenciasArray) {
                                        r2.add(
                                            KLabel(competencia.label).addCssText("text-align: center;font-size: 0.7em;border-left: 1px solid lightgray;")
                                                .addCssText("background-color: navy; color:white; padding:0px;")
                                                .setSize(100)
                                        )
                                    }
                                    return r;
                                }
                            )

                    ),

                    //Construimos ahora el cuerpo, mostrando el nombre de cada departamento así
                    //como la calificacion de cada competencia
                    KDataView()
                        .addEvenRowCssText("background-color: lightgray;")
                        .getMe((me) => this.tabla1Cuerpo = me)
                        .setCallbackBuilder(
                            (dataView, row) => {

                                let r2 = KRow();
                                let r = KRow(
                                    KLabel(row.DEPARTAMENTO).setSize(120).addCssText("text-align: left; font-size: 0.7em;"),
                                    r2.setSize(680).addCssText(""),
                                )

                                //En este momento son 8 competencias
                                for (let i = 0; i < 8; i++) {
                                    let p = row[`p${i}`];
                                    r2.add(
                                        KLabel(p).addCssText("text-align: center;font-size: 0.7em;border-left: 1px solid lightgray;").setSize(100)
                                    )
                                }
                                return r;
                            }
                        )
                )
                    .addCssText("margin-top:8px;padding:4px; border: 1px solid gray;"),



                // ============== TABLA 2 ====================
                // Tabla que muestra el promedio de cada competencia por departamento y evaluador


                KColumn(
                    KRow(
                        KLabel("Departamento").setSize(180),
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
                                    KLabel("", "DEPARTAMENTO").setSize(180).addCssText("text-align: left;font-size: 0.7em;"),
                                    KLabel("", "autoevaluacion").setSize(60).addCssText("text-align: center;font-size: 0.7em;"),
                                    KLabel("", "jefe").setSize(60).addCssText("text-align: center;font-size: 0.7em;"),
                                    KLabel("", "pares").setSize(60).addCssText("text-align: center;font-size: 0.7em;"),
                                    KLabel("", "colaboradores").setSize(60).addCssText("text-align: center;font-size: 0.7em;"),
                                    KLabel("", "promedio").setSize(60).addCssText("text-align: center;font-size: 0.7em;")
                                ).addCssText("justify-content: space-between;")
                                return r;
                            }
                        )
                        .addEvenRowCssText("background-color: lightgray;")

                ).addCssText("margin-top:8px;padding:4px; border: 1px solid gray; width: 792px;")

            )

        )

    }



    loadData3() {
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "unidadNegocio": this.unidadesNegociosSelect.getValue()
        }



        //Cargamos solo el enunciado de cada competencia
        KMessage("servidor", payload, "CARGAR_SOLO_COMPETENCIAS_360", payload)
            .send(this.server)
            .then((data) => {
                this.competenciasArray = JSON.parse(data);
                this.tabla1Encabezado.setArrayData([1]);
            });


        //CARGAR_EVALUADORES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTO
        KMessage("servidor", payload, "CARGAR_EVALUACIONES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTOS_Y_COMPETENCIAS", payload)
            .send(this.server)
            .then((data) => {
                debugger;
                console.log(data);

                data = JSON.parse(data);
                let data2 = data.filter(e => e.p0 != undefined && e.p0 != null);
                this.tabla1Cuerpo.setArrayData(data2);

            });



        //CARGAR_EVALUADORES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTO
        KMessage("servidor", payload, "CARGAR_EVALUADORES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTO", payload)
            .send(this.server)
            .then((data) => {
                data = JSON.parse(data);

                this.grafico1.init();
                for (let row of data) {
                    this.grafico1.addBar(Math.round(row.promedio), "", row.DEPARTAMENTO)
                }
                this.grafico1.render();
                this.tablaEvaluadores.setArrayData(data);
            });

    }


    loadData2() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue()
        }

        //Obtenemos los valores de todas las empresas
        KMessage("servidor", payload, "CARGAR_UNIDADES_DE_NEGOCIOS", payload)
            .send(this.server)
            .then((data) => {
                this
                    .unidadesNegociosSelect
                    .clear()
                    .importDataList(
                        this.unidadesDeNegociosDataList
                            .clear()
                            .addOptions(JSON.parse(data)));

                this.loadData3();

            });
    }


    loadData() {
        super.loadData(() => this.loadData2());
        this.getReport();
    }
    constructor() {
        super("reporte360UnidadNegocio",
            new KLauncherInfoClass("Reporte 360 Unidad de Negocio", 0, "system", true));
    }
}

new Reporte360UnidadNegocio().register();