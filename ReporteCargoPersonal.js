class ReporteCargoPersonal extends ReporteSelva {
    tituloPrincipal = "COMPETENCIAS POR CARGO";
    empleadosDataList = KDataList();
    buscadorEmpleados;

    configureReport() {
        this.getReport().add(


            KColumn(

                KRow(
                    KText("", "NOMBRES_APELLIDOS")
                        .setPlaceholder("Ingresa el nombre del empleado. Luego pulse TAB.")
                        .setSize(800)
                        .addEvent("change", (e) => {
                            this.loadData2(e);
                            e.target.self.addCssText("border: none;");
                        })
                        .getMe((me) => this.buscadorEmpleados = me)
                        //.addCssText("border: none;")
                        .addEvent("focus", (e) => e.target.self.addCssText("border: 1px solid black;"))
                        .addEvent("blur", (e) => e.target.self.addCssText("border: none;"))
                        .addCssText("font-size: 1.5em; margin-bottom: 4px;")
                    ,
                ),


                KRow(
                    KLabel("COMPAÑÍA").addCssText("flex-basis: 200px;"),
                    KLabel("", "COMPANIA").addCssText()
                ),

                KRow(
                    KLabel("UNIDAD DE NEGOCIO").addCssText("flex-basis: 200px;"),
                    KLabel("", "UNIDAD_DE_NEGOCIO").addCssText()
                ),

                KRow(
                    KLabel("DEPARTAMENTO").addCssText("flex-basis: 200px;"),
                    KLabel("", "DEPARTAMENTO").addCssText()
                )
                ,
                KRow(
                    KLabel("CARGO").addCssText("flex-basis: 200px;"),
                    KLabel("", "CARGO").addCssText()
                ),
                KRow(
                    KLabel("NÓMINA").addCssText("flex-basis: 200px;"),
                    KLabel("", "TIPO_NOMINA").addCssText()
                ),
                KRow(
                    KLabel("PROMEDIO").addCssText("flex-basis: 200px;"),
                    KLabel("", "PROMEDIO").addCssText()
                ),

            )
                .addCssText("border: 1px solid gray; padding: 4px; border-radius: 4px;"),


            KColumn(
                KRow(
                    KLabel("Competencia").addCssText("flex-basis: 500px;"),
                    KLabel("Tipo").addCssText("flex-basis: 200px;"),
                    KLabel("Calificación").addCssText("flex-basis: 80px;"),
                )
                    .addCssText("background-color: navy; color: white;")
                ,

                KDataView()
                    .setCallbackBuilder((dataView, row) => {
                        return KRow(
                            KLabel(row.COMPETENCIA).addCssText("flex-basis: 500px;"),
                            KLabel(row.TIPO_COMPETENCIA).addCssText("flex-basis: 200px;"),
                            KLabel(row.CALIFICACION).addCssText("flex-basis: 80px;")
                                .addCssText("text-align: center;")
                        )
                    })
                    .getMe((me) => this.tabla1 = me)
                    .addEvenRowCssText("background-color: silver;")

            )
                .addCssText("border: 1px solid black; padding: 4px; border-radius: 4px; margin-top: 4px;"),

        );

    }

    loadData2(e) {

        let cedulaEmpleado = e.target.self.getValue();

        //Cargar los empleado
        let payload = {
            "CEDULA": cedulaEmpleado,
            "idPeriodo": this.selectorPeriodo.getValue(),

        };


        KMessage("servidor", payload, "CARGAR_CALIFICACIONES_COMPETENCIAS_POR_CARGO_POR_EMPLEADO", payload)
            .send(this.server)
            .then((data) => {

                ;

                console.log(data);
                data = JSON.parse(data);
                console.log(data);
                this.tabla1.setArrayData(data);

                let promedio = Math.round(data.reduce((a, b) => a + parseFloat(b.CALIFICACION), 0) / data.length);
                console.log(promedio);


                KMessage("servidor", payload, "CARGAR_TRABAJADOR", payload)
                    .send(this.server)
                    .then((data) => {
                        data = JSON.parse(data);
                        data.PROMEDIO = promedio;

                        this.report.setData(data);

                    });


            });






    }

    loadData() {


        super.loadData(() => {

            let payload = {
                "idPeriodo": this.selectorPeriodo.getValue(),
                "idEvaluador": SelvaApplication.user.payload.CEDULA
            }

            KMessage("servidor", payload, "CARGAR_EVALUADOS_POR_CARGO_2", payload)
                .send(this.server)
                .then((data) => {

                    data = JSON.parse(data);
                    this.empleadosDataList.addOptions(data);
                    this.buscadorEmpleados.setDataList(this.empleadosDataList)

                });

        });







    }


    constructor() {
        super("reporteCargoPersonal",
            new KLauncherInfoClass("Competencias por cargo: Desempeño personal", 0, "system", true, "competencias_reporte.png", 32));
    }
}

new ReporteCargoPersonal().register();