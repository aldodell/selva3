class ReporteObjetivosUnidadDeNegocio extends ReporteSelva {
    tituloPrincipal = "EVALUACION POR OBJETIVOS";
    empleadosDataList = KDataList();
    buscadorEmpleados;

    configureReport() {
        this.getReport()
            .add(
                KRow(
                    KVerticalBarGraph("Unidades de negocio")
                        .setTitle(
                            KLabel("UNIDAD DE NEGOCIO")
                                .addCssText("font-weight: bold;text-align: center;")
                        )
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 400)
                        .getMe(me => this.grafico1 = me)
                )

                    .publish()
                    .setSize(800, 400),

                KRow(
                    KLabel("ID").setSize(20),
                    KLabel("UNIDAD DE NEGOCIO").setSize(680),
                    KLabel("PROMEDIO").setSize(80),
                )
                    .addCssText("margin-top:8px;padding:4px; border: 1px solid gray; background-color: navy; color: white; width: 792px;")


                ,
                KDataView()
                    .getMe(me => this.tabla1 = me)
                    .setCallbackBuilder((dv, row) => {
                        return KRow(
                            KLabel("ID", "n").setSize(20),
                            KLabel("UNIDAD DE NEGOCIO", "UNIDAD_DE_NEGOCIO").setSize(680),
                            KLabel("PROMEDIO", "promedio").setSize(80)
                                .addCssText("text-align: center;")
                        )
                    }),

                KImage("media/escala.png").setSize(300, 129)
            )
    }


    loadData() {

        super.loadData(() => {

            let payload = {
                "idPeriodo": this.selectorPeriodo.getValue(),
                //"cargo": this.selectorCargo.getValue()
            }

            KMessage("servidor", payload, "CARGAR_EVALUACION_OBJETIVOS_POR_UNIDAD_DE_NEGOCIO", payload)
                .send(this.server)
                .then((data) => {


                    data = JSON.parse(data);

                    let i = 1;
                    this.grafico1.init();
                    data = data.map(e => {
                        e.promedio = parseInt(e.promedio);
                        e.n = i;
                        i++;
                        this.grafico1.addBar(e.promedio, "", e.n, this.getColorByValue(e.promedio));
                        return e;
                    })

                    console.log(data);
                    this.grafico1.render();
                    this.tabla1.setArrayData(data);

                });

        });

    }


    constructor() {
        super("reporteObjetivosUnidadDeNegocio",
            new KLauncherInfoClass("Objetivos: Unidades de negocio", 0, "system", true, "competencias_reporte.png"));
    }
}

new ReporteObjetivosUnidadDeNegocio().register();