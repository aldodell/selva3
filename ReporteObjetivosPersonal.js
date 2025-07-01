class ReporteObjetivosPersonal extends ReporteSelva {

    tituloPrincipal = "DESEMPEÑO PERSONAL POR OBJETIVOS";
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


                KColumn()
                    .getMe(
                        column => {
                            for (let i = 1; i <= 4; i++) {


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

            )
    }


    loadData3() {

        let user = localStorage.getItem("user");
        let idEvaluador = JSON.parse(user).payload.CEDULA;

        //CARGAR_TRABAJADORES_CON_EVALUACION_POR_OBJETIVOS
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "idEvaluador": idEvaluador,
            "idEvaluado": this.selectorTrabajador.getValue()
        }

        KMessage("servidor", payload, "CARGAR_CALIFICACIONES_OBJETIVOS_POR_TRABAJADOR", payload)
            .send(this.server)
            .then((data) => {
                let promedio = 0;
                let sumaPonderaciones = 0;
                data = JSON.parse(data)[0];

                for (let i = 1; i <= 4; i++) {
                    let calificacion = Math.round(data[`calificacion${i}`] * 25);
                    let ponderacion = parseFloat(data[`ponderacion${i}`]);
                    this.objetivoLabel[i].setValue(data[`objetivo${i}`]);
                    this.ponderacionLabel[i].setValue("Ponderación: " + ponderacion);
                    this.calificacionLabel[i].setValue("Calificación: " + calificacion);
                    promedio += calificacion * ponderacion;
                    this.ponderacionT[i].setSize(`${ponderacion}%`);
                    this.ponderacionT[i].addCssText(`position: relative; left: ${sumaPonderaciones}%`);
                    this.calificacionT[i].setSize(`${calificacion}%`);
                    this.caption[i].setValue(`${calificacion}/${ponderacion}%`);
                    sumaPonderaciones += ponderacion;
                }
                promedio /= 100;
                this.promedioLabel.setValue(promedio);
            });

    }

    loadData2() {

        let user = localStorage.getItem("user");
        let idEvaluador = JSON.parse(user).payload.CEDULA;

        //CARGAR_TRABAJADORES_CON_EVALUACION_POR_OBJETIVOS
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "idEvaluador": idEvaluador
        }

        KMessage("servidor", payload, "CARGAR_TRABAJADORES_CON_EVALUACION_POR_OBJETIVOS", payload)
            .send(this.server)
            .then((data) => {
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
        super("reporteObjetivosPersonal",
            new KLauncherInfoClass("Reporte de objetivos: Desempeño personal", 0, "system", true, "objetivos_reporte.png"));
    }
}

new ReporteObjetivosPersonal().register();