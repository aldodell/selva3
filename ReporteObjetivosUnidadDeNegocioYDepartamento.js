class ReporteObjetivosUnidadDeNegocioYDepartamento extends ReporteSelva {
    tituloPrincipal = "EVALUACION POR OBJETIVOS";
    buscadorEmpleados;
    datosGenerales;


    selectorDepartamento;
    selectorUnidadDeNegocio;

    configureReport() {
        this.getReport()
            .add(

                KRow(
                    KLabel("UNIDAD DE NEGOCIO")
                        .addCssText("flex-basis: 200px; "),
                    KSelect()
                        .getMe((me) => this.selectorUnidadDeNegocio = me)
                        .addEvent("change", () => this.loadData2())

                ),

                KRow(
                    KLabel("DEPARTAMENTO")
                        .addCssText("flex-basis: 200px; "),
                    KSelect()
                        .getMe((me) => this.selectorDepartamento = me)
                        .addEvent("change", () => this.loadData3())

                ),
                KColumn(
                    KRow(
                        KLabel("PROMEDIO VENEZUELA:")
                            .addCssText("flex-basis: 300px; ")
                        ,
                        KLabel("0", "promedioVenezuela"),
                    ),
                    KRow(
                        KLabel("PROMEDIO UNIDAD DE NEGOCIO:")
                            .addCssText("flex-basis: 300px; ")
                        ,
                        KLabel("", "promedioUnidadNegocio")
                    )
                    ,
                    KRow(
                        KLabel("PROMEDIO DEPARTAMENTO:")
                            .addCssText("flex-basis: 300px; ")
                        ,
                        KLabel("", "promedioDepartamento")
                    ),
                )
                    .addCssText("width:350px; border: 1px solid gray; padding: 4px; margin-top: 8px; margin-bottom: 8px; background-color: lightgray;"),


                KRow(

                    KLabel("TRABAJADOR").setSize(680),
                    KLabel("PROMEDIO").setSize(80),
                )
                    .addCssText("margin-top:8px;padding:4px; border: 1px solid gray; background-color: navy; color: white; width: 792px;")


                ,
                KDataView()
                    .addEvenRowCssText("background-color: lightgray;")
                    .getMe(me => this.tabla1 = me)
                    .setCallbackBuilder((dv, row) => {
                        return KRow(
                            KLabel("TRABAJADOR", "trabajador").setSize(680),
                            KLabel("PROMEDIO", "calificacion").setSize(80)
                                .addCssText("text-align: center;")
                        ).setSize(802)
                    }),

                KImage("media/escala.png")
                    .setSize(300, 129)
                    .addCssText("margin-top: 8px;")
            )
    }


    loadData3() {


        let data = this.datosGenerales;
        let unidadesDeNegocio = this.selectorUnidadDeNegocio.getValue();
        let departamento = this.selectorDepartamento.getValue();
        let trabajadores = [];
        let promedioDepartamento = 0;
        let j = 0;
        data.forEach(e => {

            if (e.UNIDAD_DE_NEGOCIO == unidadesDeNegocio) {
                if (e.DEPARTAMENTO == departamento) {
                    trabajadores.push(e)
                    promedioDepartamento += parseInt(e.calificacion);
                    j++;
                }
            }

        })

        promedioDepartamento = Math.round(promedioDepartamento / j);
        this.getReport().setData({ "promedioDepartamento": promedioDepartamento });
        this.tabla1.setArrayData(trabajadores);

    }

    loadData2() {

        let data = this.datosGenerales;
        let unidadesDeNegocio = this.selectorUnidadDeNegocio.getValue();
        let departamentos = [];
        let promedioUnidadNegocio = 0;
        let j = 0;
        data.forEach(e => {
            if (e.UNIDAD_DE_NEGOCIO == unidadesDeNegocio) {
                promedioUnidadNegocio += parseInt(e.calificacion);
                j++;
                if (!departamentos.includes(e.DEPARTAMENTO)) departamentos.push(e.DEPARTAMENTO);
            }
        })

        promedioUnidadNegocio = Math.round(promedioUnidadNegocio / j);
        this.getReport().setData({ "promedioUnidadNegocio": promedioUnidadNegocio });


        this.selectorDepartamento.clear().importDataList(KDataList(departamentos));
        this.loadData3();
    }

    loadData() {

        super.loadData(() => {

            let payload = {
                "idPeriodo": this.selectorPeriodo.getValue(),
                //"cargo": this.selectorCargo.getValue()
            }

            //CARGAR_DEPARTAMENTOS

            KMessage("servidor", payload, "CARGAR_EVALUACIONES_POR_OBJETIVOS_POR_UNIDAD_DE_NEGOCIOS_Y_DEPARTAMENTOS", payload)
                .send(this.server)
                .then((data) => {
                    data = JSON.parse(data);

                    this.datosGenerales = data;
                    let unidadesDeNegocio = [];
                    let promedioVenezuela = 0;

                    data.forEach(e => {
                        if (!unidadesDeNegocio.includes(e.UNIDAD_DE_NEGOCIO)) unidadesDeNegocio.push(e.UNIDAD_DE_NEGOCIO);
                        promedioVenezuela += parseInt(e.calificacion);

                    })

                    promedioVenezuela = Math.round(promedioVenezuela / data.length);
                    this.selectorUnidadDeNegocio.clear().importDataList(KDataList(unidadesDeNegocio));
                    this.getReport().setData({ "promedioVenezuela": promedioVenezuela });
                    this.loadData2();
                })
        });
    }


    constructor() {
        super("reporteObjetivosUnidadDeNegocioYDepartamento",
            new KLauncherInfoClass("Objetivos: U.N. Departamentos", 0, "system", true, "objetivos_reporte.png"));
    }
}

new ReporteObjetivosUnidadDeNegocioYDepartamento().register();