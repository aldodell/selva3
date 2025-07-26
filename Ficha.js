class Ficha extends SelvaApplication {


    nivelSeguridad = KDataList()
        .addOption("JEFE DE DEPARTAMENTO", "3")
        .addOption("EVALUADOR", "1")
        .addOption("ADMINISTRADOR", "35")

    companias = KDataList();
    cargos = KDataList();
    departamentos = KDataList();
    unidadesNegocios = KDataList();
    niveles = KDataList();
    tiposNomina = KDataList();

    //Pantalla inicial
    initScreen;


    getInitScreen() {


        //Retornamos la pantalla inicial si ya fue definida
        if (this.initScreen) return this.initScreen;

        this.initScreen = super.getInitScreen();
        //CEDULA, NOMBRES_APELLIDOS,COMPANIA,TIPO_NOMINA, DEPARTAMENTO,CARGO,NIVEL,UNIDAD_DE_NEGOCIO

        this.initScreen.add(
            this.companias,
            this.cargos,
            this.departamentos,
            this.unidadesNegocios,
            this.niveles,
            this.tiposNomina,
            KColumn(
                KRow(
                    KLabel("Nombres y apellidos").setSize(200),
                    KText("", "NOMBRES_APELLIDOS").setSize(300)
                ),

                KRow(
                    KLabel("Cédula").setSize(200),
                    KText("", "CEDULA").setSize(300).getMe((me) => this.cedula = me)
                ),

                KRow(
                    KLabel("Ficha").setSize(200),
                    KText("", "FICHA").setSize(300)
                ),

                KRow(
                    KLabel("Fecha de ingreso").setSize(200),
                    KDatePicker("", "FECHA_INGRESO").setSize(300)
                ),
                KRow(
                    KLabel("Compañía").setSize(200),
                    KText("", "COMPANIA").setSize(300).setDataList(this.companias)
                ),
                KRow(
                    KLabel("Tipo de nómina").setSize(200),
                    KText("", "TIPO_NOMINA").setSize(300).setDataList(this.tiposNomina)
                ),
                KRow(
                    KLabel("Departamento").setSize(200),
                    KText("", "DEPARTAMENTO").setSize(300).setDataList(this.departamentos)
                ),
                KRow(
                    KLabel("Cargo").setSize(200),
                    KText("", "CARGO").setSize(300).setDataList(this.cargos)
                ),
                KRow(
                    KLabel("Nivel").setSize(200),
                    KText("", "NIVEL").setSize(300).setDataList(this.niveles)
                ),
                KRow(
                    KLabel("Unidad de negocio").setSize(200),
                    KText("", "UNIDAD_DE_NEGOCIO").setSize(300).setDataList(this.unidadesNegocios)
                ),
                KRow(
                    KLabel("Cédula del líder").setSize(200),
                    KText("", "CEDULA_LIDER").setSize(300),
                ),
                KRow(
                    KLabel("¿Es del comité?").setSize(200),
                    KCheckbox("", "COMITE").setSize(300),
                ),

                KRow(
                    KLabel("¿Está activo?").setSize(200),
                    KCheckbox("", "ACTIVO").setSize(300),
                ),

                KRow(
                    KLabel("Email").setSize(200),
                    KText("", "EMAIL").setSize(300).getMe((me) => this.email = me),
                ),
                KRow(
                    KLabel("PIN").setSize(200),
                    KText("", "PIN").setSize(300)
                        .getMe(me => this.pin = me)
                    ,
                    KButton("Enviar PIN")
                        .addEvent("click", () => {
                            this.sendPin();
                        })
                ),

                KRow(
                    KLabel("Nivel de acceso").setSize(200),
                    KSelect(this.nivelSeguridad, "NIVEL_SEGURIDAD").setSize(300),
                ),

                KRow(
                    KButton("Guardar", "").setSize(100)
                        .addEvent("click", () => {
                            this.save();
                        })

                ),
            )
                .setGap(10)
                .setMargin(10)

        )
        return this.initScreen;
    }


    sendPin() {

        debugger;
        let payload = { "email": this.email.getValue(), "pin": this.pin.getValue(), "cedula": this.cedula.getValue() };

        KMessage("", payload, "ENVIAR_PIN_UN_USUARIO")
            .send(this.server)
            .then(data => {
                alert(data);
            })

    }


    save() {
        let payload = this.initScreen.getData();


        KMessage("", payload, "GUARDAR_TRABAJADOR")
            .send(this.server)
            .then(data => {
                if (data == "OK")
                    this.navigationController.back();

            })
            .catch(err => { console.log(err); });
    }

    loadData(CEDULA) {


        //Agregamos este contador para estar seguros que se cargaron
        //todos los datos antes de pasar a la pantalla
        let steps = KStepsCounter(6, () => {
            //Navega a la pantalla inicial
            this.navigationController.navigateTo(this.getInitScreen());
            //Cargamos los datos en la pantalla
            this.initScreen.setData(this.data);
        })

        let payload = { "CEDULA": CEDULA };
        KMessage("", payload, "CARGAR_TRABAJADOR")
            .send(this.server)
            .then(data => {
                this.data = JSON.parse(data);
                steps.next();
            })
            .catch(err => { console.log(err); });


        KMessage("", {}, "CARGAR_COMPANIAS")
            .send(this.server)
            .then(data => {
                this.companias.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("", {}, "CARGAR_CARGOS")
            .send(this.server)
            .then(data => {
                this.cargos.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("", {}, "CARGAR_DEPARTAMENTOS")
            .send(this.server)
            .then(data => {
                this.departamentos.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("", {}, "CARGAR_UNIDADES_NEGOCIOS")
            .send(this.server)
            .then(data => {
                this.unidadesNegocios.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("", payload, "CARGAR_NIVELES")
            .send(this.server)
            .then(data => {
                this.niveles.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });

        KMessage("", {}, "CARGAR_TIPOS_NOMINA")
            .send(this.server)
            .then(data => {
                this.tiposNomina.addOptions(JSON.parse(data));
                steps.next();
            })
            .catch(err => { console.log(err); });





    }

    run(message) {
        this.loadData(message.payload.CEDULA);
    }

    constructor() {
        super("ficha",
            new KLauncherInfoClass("Ficha", 0, "system", true, "ficha.png", 32)
        );

    }
}

new Ficha().register();