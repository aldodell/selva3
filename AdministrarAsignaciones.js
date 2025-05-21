class AdministrarAsignaciones extends SelvaApplication {

    asigaciones = [];
    trabajadores = KDataList();
    periodos = KDataList();
    tiposEvaluacion = KDataList();
    mainDataView;


    guardarAsignacion(payload) {
        if (confirm("¿Desea guardar la asignación?")) {
            payload.idEvaluador = this.trabajadores.getValueFromLabel(payload.idEvaluador);
            payload.idEvaluado = this.trabajadores.getValueFromLabel(payload.idEvaluado);

            KMessage("servidor", payload, "ACTUALIZAR_ASIGNACION")
                .send(this.server)
                .then((r) => {
                    this.loadData(false);
                    alert(`Guardado ${r}`);
                })
                .catch(err => { alert(err.message) });
        }
    }

    eliminarAsignacion(payload) {
        if (confirm("¿Desea eliminar la asignación?")) {
            let c = prompt("Escriba la letra 'S' para confirmar").toUpperCase();
            if (c == "S") {
                KMessage("servidor", payload, "ELIMINAR_ASIGNACION")
                    .send(this.server)
                    .then((r) => {
                        this.loadData(false);
                        alert(`Eliminado ${r}`);
                    })
                    .catch(err => { alert(err.message) });
            }
        }
    }

    nuevaAsignacion() {
        KMessage("servidor", {}, "NUEVA_ASIGNACION")
            .send(this.server)
            .then((r) => {
                this.loadData(false);
            })
            .catch(err => { alert(err.message) });
    }


    transformarCedulaEnNombre(kC) {
        let v = kC.getValue();
        let l = this.trabajadores.getLabelFromValue(v);
        kC.setValue(l);
    }


    filtrar(text) {
        if (text.length > 2) {

            let filteredData = this.asigaciones.filter((row) => {

                let idEvaluado = row.idEvaluado.toString().toLowerCase();
                let idEvaluador = row.idEvaluador.toString().toLowerCase();
                text = text.toLowerCase();
                return idEvaluado.includes(text) || idEvaluador.includes(text);
            })

            this.mainDataView.clear();
            this.mainDataView.setArrayData(filteredData);
        } else {
            this.mainDataView.clear();
            this.mainDataView.setArrayData(this.asigaciones);
        }
    }

    marcarFila(record) {
        record.addCssTextOnChildren("background-color: yellow;");
        this.initScreen.mensajeLabel.setValue(" *** Recuerde grabar cada cambio haciendo click en el botón 💾 al final de cada fila. ***");
    }

    getInitScreen(asignaciones) {

        let initScreen = super.getInitScreen();
        initScreen.mensajeLabel = KLabel("").addCssText("font-weight: bold;margin-left:16px;");

        //Limpiamos todo si hay algo:
        initScreen.body.clear();

        initScreen.add(

            KRow(
                KLabel("Evaluador").setSize(300),
                KLabel("Evaluado").setSize(300),
                KLabel("Periodo").setSize(100),
                KLabel("Tipo Evaluación").setSize(300),
            ).addCssTextOnChildren("font-weight: bold; margin:4px;")
            ,

            KDataView(
                (dataView, row) => {
                    let record;
                    let saveButton;
                    KRow()
                        .getMe((me) => record = me)
                        .add(
                            KHidden(row.id, "id"),
                            KText(row.evaluador, "idEvaluador")
                                .setSize(300)
                                .setDataList(this.trabajadores)
                                .addEvent("change", (e) => {
                                    this.transformarCedulaEnNombre(e.target.self);
                                    this.marcarFila(record);


                                })
                            ,
                            KText(row.evaluado, "idEvaluado")
                                .setSize(300)
                                .setDataList(this.trabajadores)
                                .addEvent("change", (e) => {
                                    this.transformarCedulaEnNombre(e.target.self);
                                    this.marcarFila(record);
                                })
                            ,
                            KSelect(this.periodos, "idPeriodo")
                                .setSize(100)
                                .addEvent("change", (e) => {
                                    this.marcarFila(record);
                                }),
                            KSelect(this.tiposEvaluacion, "idTipoEvaluacion")
                                .setSize(300)
                                .addEvent("change", (e) => {
                                    this.marcarFila(record);
                                })
                            ,
                            KButton("💾")
                                .getMe(me => {
                                    me.record = record;
                                    saveButton = me;
                                })
                                .addEvent("click", (e) => {
                                    let me = e.target.self;
                                    let payload = me.record.getData();
                                    this.guardarAsignacion(payload);

                                })
                                .addCssText("border: solid 1px black; ")
                            ,
                            KButton("🗑️")
                                .getMe(me => me.record = record)
                                .addEvent("click", (e) => {

                                    let me = e.target.self;
                                    let payload = me.record.getData();
                                    this.eliminarAsignacion(payload);


                                })
                        )
                    return record;
                }
                ,
                asignaciones
            ).getMe(me => this.mainDataView = me)
                .addCssText("overflow-y: scroll;")

        )
            .getFoot((foot) => {
                foot.add(
                    KText()
                        .setPlaceholder("Busqueda...")
                        .addEvent("input", (e) => {
                            this.filtrar(e.target.value);
                        })
                    ,
                    KButton("Nueva Asignación")
                        .addEvent("click", () => {
                            this.nuevaAsignacion();
                        }),
                    initScreen.mensajeLabel
                )
            });


        this.initScreen = initScreen;
        return initScreen;
    }


    loadData(firstTime = true) {

        let steps = KStepsCounter(4, () => {
            //Hacemos una copia de las asignaciones
            let asigaciones = [...this.asigaciones];
            //Borramos las originales
            this.asigaciones.length = 0;
            //Transformamos cedulas en nombres
            for (let i = 0; i < asigaciones.length; i++) {
                {
                    let asignacion = asigaciones[i];
                    asignacion.idEvaluador = this.trabajadores.getLabelFromValue(asignacion.idEvaluador);
                    asignacion.idEvaluado = this.trabajadores.getLabelFromValue(asignacion.idEvaluado);
                    //Guardamos las asignaciones transformadas
                    this.asigaciones.push(asignacion);
                }
            }

            if (firstTime) {
                this.navigationController.navigateTo(this.getInitScreen(this.asigaciones));
            } else {
                this.navigationController.replace(this.getInitScreen(this.asigaciones));
            }

        })



        KMessage("servidor", {}, "CARGAR_TRABAJADORES_2")
            .send(this.server)
            .then((data) => {
                this.trabajadores.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => {
                console.log(err);
            });


        KMessage("servidor", {}, "CARGAR_PERIODOS")
            .send(this.server)
            .then((data) => {
                this.periodos.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => {
                console.log(err);
            });


        KMessage("servidor", {}, "CARGAR_TIPOS_EVALUACION")
            .send(this.server)
            .then((data) => {
                this.tiposEvaluacion.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => {
                console.log(err);
            });


        KMessage("servidor", {}, "CARGAR_ASIGNACIONES")
            .send(this.server)
            .then((data) => {

                this.asigaciones = JSON.parse(data);
                steps.next();
            })
            .catch(err => {
                console.log(err);
            });

    }

    constructor() {
        super("administrarAsignaciones",
            new KLauncherInfoClass("Administrar asignaciones", 0, "system", true));
    }
}

new AdministrarAsignaciones().register();