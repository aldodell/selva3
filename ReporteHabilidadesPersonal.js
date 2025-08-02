class ReporteHabilidadesPersonal extends ReporteSelva {

    tituloPrincipal = "HABILIDADES TECNICAS";
    selectorEmpleado;
    objetivoLabel = [];
    ponderacionLabel = [];
    calificacionLabel = [];
    calificacionT = [];
    ponderacionT = [];
    caption = [];

    configureReport() {
        this.getReport()
            .add(
                KColumn(
                    KRow(
                        KLabel("Empleado:"),
                        KSelect()
                            .getMe((me) => this.selectorTrabajador = me)
                            .addEvent("change", () => this.loadData3())
                    ),

                    KRow(
                        KLabel("Promedio:"),
                        KLabel().getMe((me) => this.promedioLabel = me)

                    )
                )
                    .applySimpleRoundedBorder()
                    .addCssText("margin-top: 8px; margin-bottom: 8px; padding: 4px;")

                ,

                KRow(
                    KVerticalBarGraph("HABILIDADES TECNICAS")
                        .setSize(800, 400)
                        .getMe(me => this.grafico1 = me)
                        .addReferenceValues(0, 25, 50, 75, 100)

                ).setSize(800, 400),
                KRow(
                    KImage("media/escala.png")
                        .setSize(300, 129)
                        .addCssText("margin-top: 8px;")
                ).setSize(300, 129)
            )

    }


    loadData3() {

        let user = localStorage.getItem("user");
        let idEvaluador = JSON.parse(user).payload.CEDULA;


        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "idEvaluador": idEvaluador,
            "idEvaluado": this.selectorTrabajador.getValue()
        }

        KMessage("servidor", payload, "CARGAR_CALIFICACIONES_HABILIDADES_TECNICAS", payload)
            .send(this.server)
            .then((data) => {
                ;
                let promedio = 0;
                let sumaPonderaciones = 0;
                data = JSON.parse(data);

                this.grafico1.init();

                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    let calificacion = Math.round(row["calificacion"]);
                    let habilidad = row["habilidad"];
                    this.grafico1.addBar(calificacion, "", habilidad, this.getColorByValue(calificacion));
                    promedio += calificacion;
                }

                this.grafico1.render();

                promedio /= 4;
                this.promedioLabel.setValue(promedio);
            });



    }

    loadData2() {

        let user = localStorage.getItem("user");
        let idEvaluador = JSON.parse(user).payload.CEDULA;


        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "idEvaluador": idEvaluador
        }

        KMessage("servidor", payload, "CARGAR_TRABAJADORES_CON_EVALUACION_HABILIDADES_TECNICAS", payload)
            .send(this.server)
            .then((data) => {
                ;
                data = JSON.parse(data);
                let empleados = KDataList().clear().addOptions(data);
                this.selectorTrabajador.clear().importDataList(empleados);
                this.loadData3();
            });


    }

    loadData() {
        super.loadData(() => this.loadData2());
    }

    constructor() {
        super("reporteHabilidadesPersonal",
            new KLauncherInfoClass("Habilidades técnicas: Desempeño personal", 0, "system", true, "habilidades_reporte.png", 32));
    }
}

new ReporteHabilidadesPersonal().register();

/*
                KColumn()
                    .getMe(
                        column => {
                            for (let i = 0; i < 4; i++) {


                                column.add(
                                    // -----------
                                    KRow(
                                        KColumn(
                                            KRow(
                                                KLabel("objetivo1")
                                                    .getMe((me) => this.objetivoLabel[i] = me)

                                            )
                                                .addCssText("background-color: navy; color: white; width: 792px; padding: 4px; border-radius: 5px;")
                                            ,
                                            KColumn(
                                                KLabel("30%")
                                                    .getMe((me) => this.ponderacionLabel[i] = me),
                                                KLabel("97")
                                                    .getMe((me) => this.calificacionLabel[i] = me)
                                            )
                                        )
                                    )
                                        .applySimpleRoundedBorder()
                                        .addCssText("margin-top: 8px;padding: 4px;"),

                                    KRow(
                                        KRow(
                                            KRow(
                                                KLabel()
                                                    .getMe((me) => this.caption[i] = me)
                                                    .addCssText("background-color: white; text-align: center; width: 100%; margin:8px; padding: 8px; border-radius: 8px;")
                                            )
                                                .getMe((me) => this.calificacionT[i] = me)
                                                .addCssText("background-color: navy; margin: 4px; ")
                                                .applySimpleRoundedBorder()
                                        )
                                            .getMe((me) => this.ponderacionT[i] = me)
                                            .applySimpleRoundedBorder()
                                            .addCssText("background-color: silver;")
                                    )
                                        .applySimpleRoundedBorder()
                                        .addCssText(" margin-bottom: 8px; margin-top: 1px; padding: 4px; background-color:rgb(192, 213, 216);")

                                )
                            }


                        }
                    )

*/