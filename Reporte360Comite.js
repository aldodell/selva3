class Reporte360Comite extends ReporteSelva {

    tituloPrincipal = "360 COMITE";

    configureReport() {

        this.getReport()
            .add(

                KRow(
                    KLabel("PROMEDIO COMITE")
                        .addCssText("font-weight: bold;")
                        .getMe(me => this.promedioComiteLabel = me)
                ),
                //bambina.
                KColumn(
                    KRow(
                        KLabel("LIDER").setSize(350),
                        KLabel("DEPARTAMENTO").setSize(300),
                        KLabel("PROMEDIO").setSize(100),

                    ).addCssText("background-color:navy; color: white; font-weight: bold;")
                    ,

                    KDataView()
                        .getMe(me => this.tabla1 = me)
                        .addEvenRowCssText("background-color: lightgray;")
                        .setCallbackBuilder((dv, row) => {
                            row["promedio"] = Math.round(parseFloat(row["promedio"]));
                            return KRow(
                                KLabel("", "NOMBRES_APELLIDOS").setSize(350),
                                KLabel("", "DEPARTAMENTO").setSize(300),
                                KLabel("", "promedio").setSize(100).addCssText("text-align: center;"),

                            )
                        }),
                ).addCssText("border: 1px solid gray;  width: 792px; margin-top:8px;padding:4px; border-radius: 4px;")

                ,

                KRow(
                    KVerticalBarGraph("Evaluadores")
                        .addReferenceValues(60, 70, 80, 90, 100)
                        .setSize(800, 300)
                        .getMe(me => this.grafico1 = me)
                        .setBarWidth(100)
                ).setSize(800, 300)
                ,


                KRow(

                    KColumn(

                        KRow(
                            KDataView()
                                .getMe(me => this.encabezado2 = me)
                                .setCallbackBuilder((dv, row) => {
                                    let r = KRow(
                                        KLabel("LIDER", "NOMBRES_APELLIDOS")
                                            .setSize(200, 40)
                                            .addCssText("font-size: 0.8em; font-weight: bold;")


                                    )

                                    row.forEach(element => {
                                        r.add(
                                            KLabel(element.competencia)
                                                .setSize(75, 60)
                                                .addCssText("font-size: 0.7em; font-weight: bold;")

                                                .addCssText("text-align: center;")
                                        )
                                    });

                                    return r;

                                })
                        ).addCssText("background-color:navy; color: white; padding: 4px;")
                        ,

                        KRow(
                            KDataView()
                                .getMe(me => this.tabla2 = me)
                                .addEvenRowCssText("background-color: lightgray;")
                                .setCallbackBuilder((dv, row) => {
                                    let r = KRow(
                                        KLabel(row[0], "NOMBRES_APELLIDOS")
                                            .setSize(200)
                                            .addCssText("font-size: 0.9em; ")


                                    )

                                    for (let i = 1; i < row.length; i++) {
                                        r.add(
                                            KLabel(row[i])
                                                .setSize(75)
                                                .addCssText("font-size: 0.9em; ")
                                                .addCssText("text-align: center;")
                                        )
                                    }


                                    return r;

                                })


                        )
                    )
                )
                    .addCssText("position: relative; top:16px; ")

                ,


                KRow(
                    KImage("media/escala.png")
                        .setSize(300, 129)
                        .addCssText("margin-top:8px;")

                ).setSize(300, 129)
                    .addCssText("position: relative; top:16px; ")

            )



    }

    loadData2() {


        let payload = {
            idPeriodo: this.selectorPeriodo.getValue()
        }


        //Obtenemos los valores de todas las empresas
        KMessage("servidor", payload, "CARGAR_EVALUADORES_360_COMITE", payload)
            .send(this.server)
            .then((data) => {

                data = JSON.parse(data);

                ;

                this.tabla1.setArrayData(data);

                let promedioComite = Math.round(data.reduce((a, b) => a + parseFloat(b.promedio), 0) / data.length);

                let promedioAutoevaluacion = data.reduce((a, b) => a + parseFloat(b.autoevaluacion), 0) / data.length;
                let promedioJefe = data.reduce((a, b) => a + parseFloat(b.jefe), 0) / data.length;
                let promedioPares = data.reduce((a, b) => a + parseFloat(b.pares), 0) / data.length;
                let promedioColaboradores = data.reduce((a, b) => a + parseFloat(b.colaboradores), 0) / data.length;

                this.grafico1.init()
                this.grafico1.addBar(promedioAutoevaluacion, "promedio", "Autoevaluacion", this.getColorByValue(promedioAutoevaluacion))
                this.grafico1.addBar(promedioJefe, "promedio", "Jefe", this.getColorByValue(promedioJefe))
                this.grafico1.addBar(promedioPares, "promedio", "Pares", this.getColorByValue(promedioPares))
                this.grafico1.addBar(promedioColaboradores, "promedio", "Colaboradores", this.getColorByValue(promedioColaboradores))
                this.grafico1.render();

                this.promedioComiteLabel.setValue(`PROMEDIO COMITE: ${promedioComite}`);


            });


        //CARGAR_EVALUACIONES_COMITE_POR_COMPETENCIA
        KMessage("servidor", payload, "CARGAR_EVALUACIONES_COMITE_POR_COMPETENCIA", payload)
            .send(this.server)
            .then((data) => {
                ;
                data = JSON.parse(data);
                let competencias = data.competencias;
                let calificaciones = data.calificaciones;


                let calificacionesX = [];
                calificaciones.forEach((c) => {
                    let r = [];
                    r.push(c.NOMBRES_APELLIDOS);
                    c.calificaciones.forEach((ca) => {
                        r.push(ca);
                    })
                    calificacionesX.push(r);
                })



                this.encabezado2.buildByData(competencias)
                this.tabla2.setArrayData(calificacionesX);
            });



    }


    loadData() {
        super.loadData(() => this.loadData2());
        this.getReport();

    }
    constructor() {
        super("reporte360Comite",
            new KLauncherInfoClass("360 Comité", 0, "system", true, "360r.png", 32));
    }
}

new Reporte360Comite().register();

