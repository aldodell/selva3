class ReporteHabilidadesUnidadDeNegocioYDepartamento extends ReporteSelva {
    tituloPrincipal = "HABILIDADES TECNICAS POR UNIDAD DE NEGOCIO";

    configureReport() {
        this.getReport()
            .add(

                KColumn(


                    KRow(
                        KLabel("UNIDAD DE NEGOCIO")
                            .addCssText("flex-basis: 200px; "),
                        KSelect()
                            .getMe((me) => this.selectorUnidadDeNegocio = me)
                            .addEvent("change", () => this.loadData3()),
                        KLabel("PROMEDIO:0")
                            .getMe(me => this.promedioUnidadDeNegocioLabel = me)
                            .addCssText("position: absolute; right: 100px;")
                        ,


                    ),

                    KRow(
                        KLabel("DEPARTAMENTO")
                            .addCssText("flex-basis: 200px; "),

                        KSelect()
                            .getMe((me) => this.selectorDepartamento = me)
                            .addEvent("change", () => this.loadData4()),
                        KLabel("PROMEDIO:0")
                            .getMe(me => this.promedioDepartamentoLabel = me)
                            .addCssText("position: absolute; right: 100px;")
                        ,

                    )
                ).applySimpleRoundedBorder()

                ,

                KColumn(
                    KRow(
                        KLabel("EMPLEADO").setSize(400),
                        KLabel("CALIFICACION").setSize(40)
                    ).addCssText("background-color: navy; color: white; font-weight: bold;")

                    ,
                    KDataView()
                        .getMe(me => this.tabla1 = me)
                        .setCallbackBuilder((dataView, row) => {
                            return KRow(
                                KLabel(row["NOMBRES_APELLIDOS"]).setSize(400),
                                KLabel(row["calificacion"]).setSize(40)
                            )

                        })
                )
                    .applySimpleRoundedBorder()
                    .addCssText("padding:8px; overflow:hidden;"),
                KRow(
                    KImage("media/escala.png")
                        .setSize(300, 129)

                )
                    .setSize(300, 129)
                    .addCssText("margin-top: 8px;")
            )


    }








    loadData4() {

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "unidadNegocio": this.selectorUnidadDeNegocio.getValue(),
            "departamento": this.selectorDepartamento.getValue()
        }
        KMessage("servidor", payload, "CARGAR_HABILIDADES_TECNICAS_POR_UNIDAD_DE_NEGOCIO_DEPARTAMENTO_TRABAJADOR")
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);
                this.tabla1.setArrayData(data);
            });

        KMessage("servidor", payload, "CARGAR_HABILIDADES_TECNICAS_PROMEDIOS")
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);
                let promedioDepartamento = (data["promedioDepartamento"][0]).calificacion;
                let promedioUnidadDeNegocio = (data["promedioUnidadNegocio"][0]).calificacion;
                this.promedioDepartamentoLabel.setValue(`PROMEDIO: ${promedioDepartamento}`)
                this.promedioUnidadDeNegocioLabel.setValue(`PROMEDIO: ${promedioUnidadDeNegocio}`)
            });
    }


    loadData3() {
        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue(),
            "unidadNegocio": this.selectorUnidadDeNegocio.getValue()
        }


        KMessage("servidor", payload, "CARGAR_DEPARTAMENTOS_CON_HABILIDADES_TECNICAS")
            .send(this.server)
            .then((data) => {
                data = JSON.parse(data);
                this.selectorDepartamento.clear().importDataList(KDataList(data));
                this.loadData4();
            });


    }


    loadData2() {

        let payload = {
            "idPeriodo": this.selectorPeriodo.getValue()
        }
        //
        KMessage("servidor", payload, "CARGAR_UNIDADES_NEGOCIO_CON_HABILIDADES_TECNICAS")
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);
                this.selectorUnidadDeNegocio.clear().importDataList(KDataList(data));
                this.loadData3();
            });
    }


    loadData() {
        super.loadData(() => this.loadData2());
    }

    constructor() {
        super("reporteHabilidadesUnidadDeNegocioDepartamento",
            new KLauncherInfoClass("Habilidades técnicas: U.N./Departamento", 0, "system", true, "habilidades_reporte.png"));
    }
}

new ReporteHabilidadesUnidadDeNegocioYDepartamento().register();