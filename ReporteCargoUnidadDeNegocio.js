class ReporteCargoUnidadDeNegocio extends ReporteSelva {
    tituloPrincipal = "COMPETENCIAS POR CARGO";
    empleadosDataList = KDataList();
    buscadorEmpleados;

    configureReport() {
        this.getReport()
            .add(
                KRow(
                    KVerticalBarGraph("Unidades de negocio")
                    .setTitle(
                        KLabel("EVALUACION POR UNIDAD DE NEGOCIO")
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
                            KLabel("PROMEDIO", "calificacion").setSize(80)
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

            KMessage("servidor", payload, "CARGAR_EVALUACION_POR_CARGO_POR_UNIDAD_DE_NEGOCIO", payload)
                .send(this.server)
                .then((data) => {

                    debugger;
                    data = JSON.parse(data);

                    let i = 1;
                    this.grafico1.init();
                    data = data.map(e => {
                        e.n = i;
                        i++;
                        this.grafico1.addBar(e.calificacion, "", e.n, this.getColorByValue(e.calificacion));
                        return e;
                    })

                    console.log(data);
                    this.grafico1.render();
                    this.tabla1.setArrayData(data);

                });

        });

    }


    constructor() {
        super("reporteCargoUnidadDeNegocio",
            new KLauncherInfoClass("Competencias por cargo: Unidades de negocio", 0, "system", true, "competencias_reporte.png"));
    }
}

new ReporteCargoUnidadDeNegocio().register();