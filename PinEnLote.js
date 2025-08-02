class PinEnLote extends SelvaApplication {

    colaCorreos = [];
    temporizador;

    getInitScreen() {

        let initScreen = super.getInitScreen();

        //Limpiamos todo si hay algo:
        initScreen.body.clear();

        initScreen.add(

            KRow(
                KLabel("Persona").setSize(400),
                KLabel("Email").setSize(300),
                KLabel("Cambiar PIN").setSize(100),
                KLabel("Enviar correo").setSize(100),


            ).addCssTextOnChildren("font-weight: bold; margin:4px;")
            ,

            KDataView()
                .setCallbackBuilder(
                    (dataView, row) => {

                        return KRow(
                            KLabel("Persona")
                                .setSize(400)
                                .setValue(row.NOMBRES_APELLIDOS)
                                .setName("NOMBRES_APELLIDOS")

                            ,
                            KLabel("Email")
                                .setSize(300)
                                .setValue(row.EMAIL)
                                .setName("EMAIL")
                            ,
                            KCheckbox()
                                .setSize(100)
                                .setValue(row["cambiar"])
                                .setName("cambiar"),

                            KCheckbox()
                                .setSize(100)
                                .setValue(row["enviar"])
                                .setName("enviar"),

                            KHidden()
                                .setValue(row["CEDULA"])
                                .setName("CEDULA"),

                            KHidden()
                                .setValue(row["n"])
                                .setName("n")



                        );
                    }
                )
                .getMe(me => this.tabla = me),


        )
            .getFoot(foot => {
                foot.add(
                    KRow(
                        KLabel("Seleccionar/deseleccionar todos")
                            .addCssText("margin:8px;"),
                        KButton("Pines")
                            .addEvent("click", () => {
                                this.trabajadores.map((t) => {
                                    t.cambiar = !t.cambiar;

                                })
                                this.tabla.setArrayData(this.trabajadores);
                            })
                            .addCssText("margin:8px;")
                        ,
                        KButton("Envío").addEvent("click", () => {
                            this.trabajadores.map((t) => {
                                t.enviar = !t.enviar;

                            })
                            this.tabla.setArrayData(this.trabajadores);
                        })
                            .addCssText("margin:8px;")
                        ,
                        KButton("Procesar")
                            .addEvent("click", () => {
                                this.procesar();
                            })
                            .setSize(200)
                             .addCssText("margin:8px;")
                    )

                )
            }),


            this.initScreen = initScreen;
        return initScreen;
    }

    procesar() {

        //Recorremos todos los usuarios para cambiar los pines

        this.tabla.iterateFields((named, fields) => {

            let n = parseInt(named["n"]);
            this.trabajadores[n].cambiar = named["cambiar"] == "1";
            this.trabajadores[n].enviar = named["enviar"] == "1";
        })

        this.trabajadores.map(t => {



            if (t.cambiar == "1") {
                let payload = {
                    "cedula": t.cedula,
                }

                //CAMBIAR_PIN_UNO
                KMessage("servidor", payload, "CAMBIAR_PIN_UN_USUARIO")
                    .send(this.server)
                    .then((data) => {
                        t.cambiar = false;
                    })
                    .catch(err => {
                        console.log(err);
                        alert(err);
                    })

            }

            //Enviamos a la cola de mensajes
            if (t.enviar == "1") {
                this.colaCorreos.push(t);
            }

        })


        //Iniciamos el bucle:
        this.temporizador = window.setInterval(this.bucleCorreo, 1000, this);

    }



    bucleCorreo(me) {

        debugger;

        //Obtenemos un trabajdor
        let t = me.colaCorreos.shift();

        //Si se acab'o la lista paramos el temporizador y salimos 
        if (t == undefined) {
            window.clearInterval(me.temporizador);
            return;
        }

        let payload = {
            "email": t.EMAIL,
            "cedula": t.CEDULA,
        }

        KMessage("servidor", payload, "ENVIAR_PIN_UN_USUARIO")
            .send(me.server)
            .then((data) => {
                let n = parseInt(t.n);
                me.tabla.getComponent(n, "enviar").setValue(false);
            })
            .catch(err => {
                console.log(err);
            })
    }






    cambiarPinUnUsuario(cedula) {
        let payload = {
            "cedula": cedula
        }

        //CAMBIAR_PIN_UNO
        KMessage("servidor", payload, "CAMBIAR_PIN_UN_USUARIO")
            .send(this.server)
            .then((data) => {
                if (data == "OK") {
                    alert("Pin cambiado");
                }
            })
            .catch(err => {
                console.log(err);
            })
    }





    loadData() {
        KMessage("servidor", {}, "CARGAR_TRABAJADORES_3")
            .send(this.server)
            .then((data) => {

                this.navigationController.navigateTo(this.getInitScreen());
                data = JSON.parse(data);
                let n = 0;
                data.map(element => {
                    element.n = n;
                    element["enviar"] = false;
                    element["cambiar"] = false;
                    n++;
                });

                this.trabajadores = data;
                this.tabla.setArrayData(data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    constructor() {
        super("pinEnLote",
            new KLauncherInfoClass("PIN en lote", 0, "system", true, "enviar.png", 32)
        );
    }
}

new PinEnLote().register();