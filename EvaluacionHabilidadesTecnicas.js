class EvaluacionHabilidadesTecnicas extends Evaluacion360 {


    CARGAR_EVALUADOS = "CARGAR_EVALUADOS_PARA_HABILIDADES_TECNICAS";
    CARGAR_EVALUACIONES = "CARGAR_EVALUACIONES_HABILIDADES_TECNICAS";
    GUARDAR_ITEM_EVALUACION = "GUARDAR_ITEM_EVALUACION_HABILIDADES_TECNICAS";
    CARGAR_COMPETENCIAS = "CARGAR_HABILIDADES_TECNICAS";

    constructor() {
        super("evaluacionHabilidadesTecnicas",
            new KLauncherInfoClass("Habilidades técnicas", 0, "system", true, "habilidades.png",32)
        );
    }
}

new EvaluacionHabilidadesTecnicas().register();