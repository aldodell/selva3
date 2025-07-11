<?php

/**
 * Selva3 PHP Server
 */

//User
$user = "aasxwjte_selva";
$password = "Selva2024.";
$databaseName = "aasxwjte_selva";

//Connect to database
$database = new PDO('mysql:host=localhost;dbname=aasxwjte_selva', 'aasxwjte_selva', 'Selva2024.');

//Convert json to object
$message = json_decode($_POST["message"], false);

//Get verb from message
$verb = $message->verb;

//get payload from message
$payload = $message->payload;


switch ($verb) {
    case "ping":
        echo "pong";
        break;

    /**
     * Carga los parámetros básicos de todos los trabajadores
     * 
     */


    case "VALIDAR_USUARIO":
        try {
            $sql = "SELECT NOMBRES_APELLIDOS, CEDULA, COMPANIA, EMAIL, UNIDAD_DE_NEGOCIO, NIVEL_SEGURIDAD FROM expediente WHERE email = :email AND pin  = :pin";
            $statement = $database->prepare($sql);
            $statement->bindParam(":email", $payload->EMAIL);
            $statement->bindParam(":pin", $payload->PIN);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);
            $r = json_encode($result);
            echo $r;

            break;
        } catch (Exception $e) {
            echo $e->getMessage();
            die();
        }


    case "CARGAR_TRABAJADORES":
        $sql = "SELECT CEDULA, NOMBRES_APELLIDOS,COMPANIA,TIPO_NOMINA, DEPARTAMENTO,CARGO,NIVEL,UNIDAD_DE_NEGOCIO FROM expediente ORDER BY NOMBRES_APELLIDOS ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_TRABAJADOR":
        $sql = "SELECT * FROM expediente WHERE CEDULA = :CEDULA";
        $statement = $database->prepare($sql);
        $statement->bindParam(":CEDULA", $payload->CEDULA);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    case "CARGAR_COMPANIAS":
        $sql = "SELECT DISTINCT COMPANIA as label, COMPANIA as value FROM expediente ORDER BY COMPANIA ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_CARGOS":
        $sql = "SELECT DISTINCT CARGO as label, CARGO as value FROM expediente ORDER BY CARGO ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_DEPARTAMENTOS":
        $sql = "SELECT DISTINCT DEPARTAMENTO as label, DEPARTAMENTO as value FROM expediente ORDER BY DEPARTAMENTO ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_UNIDADES_NEGOCIOS":
        $sql = "SELECT DISTINCT UNIDAD_DE_NEGOCIO as label, UNIDAD_DE_NEGOCIO as value FROM expediente ORDER BY UNIDAD_DE_NEGOCIO ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_NIVELES":
        $sql = "SELECT DISTINCT NIVEL as label, NIVEL as value  FROM expediente ORDER BY NIVEL ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_TIPOS_NOMINA":
        $sql = "SELECT DISTINCT TIPO_NOMINA as label, TIPO_NOMINA as value FROM expediente ORDER BY TIPO_NOMINA ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "GUARDAR_TRABAJADOR":

        try {
            //Revisamos si ya existe este trabajador a partir de su CEDULA
            $sql = "SELECT * FROM expediente WHERE CEDULA = :CEDULA";
            $statement = $database->prepare($sql);
            $statement->bindParam(":CEDULA", $payload->CEDULA);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            if (!$result) {
                //Ahora que sabemos que no existe creamos el trabajador a partir de su CEDULA
                $sql = "INSERT INTO expediente (CEDULA) VALUES (:CEDULA)";
                $statement = $database->prepare($sql);
                $statement->bindParam(":CEDULA", $payload->CEDULA);
                $statement->execute();
            }
        } catch (Exception $e) {
            echo $e->getMessage();
            die();
        }

        try {
            //Ahora que estamos seguro que tenemos el registro del trabajado entonces lo actualizamos
            $sql = "UPDATE expediente SET 
            NOMBRES_APELLIDOS = :NOMBRES_APELLIDOS,
            COMPANIA = :COMPANIA,
            TIPO_NOMINA = :TIPO_NOMINA,
            DEPARTAMENTO = :DEPARTAMENTO,
            CARGO = :CARGO,
            NIVEL = :NIVEL,
            UNIDAD_DE_NEGOCIO = :UNIDAD_DE_NEGOCIO,
            EMAIL = :EMAIL,
            ACTIVO = :ACTIVO,
            COMITE = :COMITE,
            CEDULA_LIDER = :CEDULA_LIDER,
            PIN = :PIN,
            NIVEL_SEGURIDAD = :NIVEL_SEGURIDAD,
            FICHA = :FICHA,
            FECHA_INGRESO = :FECHA_INGRESO
            WHERE CEDULA = :CEDULA";
            $statement = $database->prepare($sql);
            $statement->bindParam(":CEDULA", $payload->CEDULA);
            $statement->bindParam(":NOMBRES_APELLIDOS", $payload->NOMBRES_APELLIDOS);
            $statement->bindParam(":COMPANIA", $payload->COMPANIA);
            $statement->bindParam(":TIPO_NOMINA", $payload->TIPO_NOMINA);
            $statement->bindParam(":DEPARTAMENTO", $payload->DEPARTAMENTO);
            $statement->bindParam(":CARGO", $payload->CARGO);
            $statement->bindParam(":NIVEL", $payload->NIVEL);
            $statement->bindParam(":UNIDAD_DE_NEGOCIO", $payload->UNIDAD_DE_NEGOCIO);
            $statement->bindParam(":EMAIL", $payload->EMAIL);
            $statement->bindParam(":ACTIVO", $payload->ACTIVO);
            $statement->bindParam(":COMITE", $payload->COMITE);
            $statement->bindParam(":CEDULA_LIDER", $payload->CEDULA_LIDER);
            $statement->bindParam(":PIN", $payload->PIN);
            $statement->bindParam(":NIVEL_SEGURIDAD", $payload->NIVEL_SEGURIDAD);
            $statement->bindParam(":FICHA", $payload->FICHA);
            $statement->bindParam(":FECHA_INGRESO", $payload->FECHA_INGRESO);
            $statement->execute();
            echo "OK";
            break;

        } catch (Exception $e) {
            echo $e->getMessage();
            die();
        }


    case "CARGAR_COMPETENCIAS_360":
        $sql = "SELECT * FROM competencias360";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    //Carga solo las competencias (distintas) y en orden alfabetico
    case "CARGAR_SOLO_COMPETENCIAS_360":
        $sql = "SELECT DISTINCT COMPETENCIA as label, COMPETENCIA as value FROM competencias360 ORDER BY COMPETENCIA ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "ACTUALIZAR_COMPETENCIA_360":

        try {
            $anterior = $payload->anterior;
            $nueva = $payload->nueva;
            $sql = "UPDATE competencias360 set COMPETENCIA=? WHERE COMPETENCIA=?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $nueva);
            $statement->bindValue(2, $anterior);
            $statement->execute();
            echo "OK";

        } catch (Exception $e) {
            print_r($e);
        }
        break;

    case "ACTUALIZAR_COMPORTAMIENTO_360":
        try {
            $id = $payload->id;
            $nuevo = $payload->nuevo;
            $sql = "UPDATE competencias360 SET COMPORTAMIENTO = ? WHERE id = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $nuevo);
            $statement->bindValue(2, $id);
            $statement->execute();
            echo "OK";
        } catch (Exception $e) {
            print_r($e);
        }
        break;

    case "CARGAR_COMPETENCIAS_POR_CARGO":
        $sql = "SELECT * FROM competenciasPorCargos order by CARGO ASC, competencia ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "ACTUALIZAR_COMPETENCIA_POR_CARGO":
        try {
            $id = $payload->id;
            $CARGO = $payload->CARGO;
            $COMPETENCIA = $payload->COMPETENCIA;
            $TIPO_COMPETENCIA = $payload->TIPO_COMPETENCIA;
            $GRADO = $payload->GRADO;
            $DESCRIPCION = $payload->DESCRIPCION;

            $sql = "UPDATE competenciasPorCargos SET CARGO = ?, COMPETENCIA = ?, TIPO_COMPETENCIA = ?, GRADO = ?, DESCRIPCION = ? WHERE id = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $CARGO);
            $statement->bindValue(2, $COMPETENCIA);
            $statement->bindValue(3, $TIPO_COMPETENCIA);
            $statement->bindValue(4, $GRADO);
            $statement->bindValue(5, $DESCRIPCION);
            $statement->bindValue(6, $id);
            $statement->execute();
            echo "OK";

        } catch (Exception $e) {
            print_r($e);
        }
        break;

    case "NUEVA_COMPETENCIA_POR_CARGO":
        $sql = "INSERT INTO competenciasPorCargos (CARGO) VALUES (' ')";
        $statement = $database->prepare($sql);
        $statement->execute();
        echo "OK";
        break;

    case "ELIMINAR_COMPETENCIA_POR_CARGO":
        $id = $payload->id;
        $sql = "DELETE FROM competenciasPorCargos WHERE id = ?";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $id);
        $statement->execute();
        echo "OK";
        break;

    case "CARGAR_ASIGNACIONES":
        $sql = "SELECT * FROM asignaciones order by idEvaluador";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    // Carga los nombres y apellidos como label y c'edula como value
    case "CARGAR_TRABAJADORES_2":
        $sql = "SELECT NOMBRES_APELLIDOS as label, CEDULA as value FROM expediente ORDER BY NOMBRES_APELLIDOS ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_PERIODOS":
        $sql = "SELECT DISTINCT descripcion as label, id as value FROM periodos_evaluativos";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_TIPOS_EVALUACION":
        $sql = "SELECT DISTINCT descripcion as label, id as value FROM tipoEvaluacion";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "ACTUALIZAR_ASIGNACION":
        $sql = "UPDATE asignaciones SET idEvaluador = ?, idEvaluado = ?, idPeriodo = ?, idTipoEvaluacion = ? WHERE id = ?";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idEvaluador);
        $statement->bindValue(2, $payload->idEvaluado);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->bindValue(4, $payload->idTipoEvaluacion);
        $statement->bindValue(5, $payload->id);
        $statement->execute();
        echo "OK";
        break;

    case "ELIMINAR_ASIGNACION":
        $sql = "DELETE FROM asignaciones WHERE id = ?";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->id);
        $statement->execute();
        echo "OK";
        break;

    case "NUEVA_ASIGNACION":
        $sql = "INSERT INTO asignaciones (idEvaluador, idEvaluado, idPeriodo, idTipoEvaluacion) VALUES (0,0,1,1)";
        $statement = $database->prepare($sql);
        $statement->execute();
        echo "OK";
        break;

    case "CARGAR_EVALUADOS_PARA_360":
        $sql = "SELECT asignaciones.idEvaluado as value, expediente.NOMBRES_APELLIDOS as label
                FROM asignaciones INNER JOIN expediente
                ON asignaciones.idEvaluado = expediente.CEDULA
                WHERE
                asignaciones.idPeriodo = ?
                AND
                asignaciones.idEvaluador = ?
                AND
                asignaciones.idTipoEvaluacion = 1;";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    //Carga las evaluaciones (si existen) de un evaluador para un evaluado
    case "CARGAR_EVALUACIONES_360":
        try {
            $sql = "SELECT * FROM evaluaciones360 WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluador);
            $statement->bindValue(2, $payload->idEvaluado);
            $statement->bindValue(3, $payload->idPeriodo);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);

        } catch (Exception $e) {
            echo "Error: $e";
        }

        break;

    case "GUARDAR_ITEM_EVALUACION_360":
        try {
            $sql = "INSERT INTO evaluaciones360 (id, idEvaluador, idEvaluado, idPeriodo, idItem, calificacion, fechaEvaluacion) VALUES (?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE calificacion = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->id);
            $statement->bindValue(2, $payload->idEvaluador);
            $statement->bindValue(3, $payload->idEvaluado);
            $statement->bindValue(4, $payload->idPeriodo);
            $statement->bindValue(5, $payload->idItem);
            $statement->bindValue(6, $payload->calificacion);
            $statement->bindValue(7, $payload->fechaEvaluacion);
            $statement->bindValue(8, $payload->calificacion);
            $statement->execute();

            $object = new stdClass();
            $object->id = $database->lastInsertId();
            $object->indice = $payload->indice;

            echo json_encode($object);

        } catch (Exception $e) {
            print_r($e);
        }
        break;



    /*      ======        COMPETENCIAS POR CARGO  ======== */


    //Carga los evaluados para competencias por cargo
    case "CARGAR_EVALUADOS_PARA_COMPETENCIAS_POR_CARGO":
        $sql = "SELECT asignaciones.idEvaluado as value, expediente.NOMBRES_APELLIDOS as label
                FROM asignaciones INNER JOIN expediente
                ON asignaciones.idEvaluado = expediente.CEDULA
                WHERE
                asignaciones.idPeriodo = ?
                AND
                asignaciones.idEvaluador = ?
                AND
                asignaciones.idTipoEvaluacion = 2;";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;



    case "CARGAR_COMPETENCIAS_POR_CARGO_PARA_UN_EVALUADO":
        try {
            $sql = "SELECT cpc.id, cpc.COMPETENCIA, cpc.DESCRIPCION AS COMPORTAMIENTO
                    FROM
                    expediente ex
                    LEFT JOIN
                    cargosHomologados ch 
                    ON ex.CARGO = ch.CARGO
                    LEFT JOIN
                    competenciasPorCargos cpc
                    ON ch.HOMOLOGACION = cpc.CARGO
                    WHERE
                    ex.CEDULA = ?
                    GROUP BY
                    cpc.DESCRIPCION
                    ORDER BY
                    cpc.id;   
            ";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluado);

            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } catch (Exception $e) {
            echo "Error: $e";
        }
        break;



    //Carga las evaluaciones (si existen) de un evaluador para un evaluado
    case "CARGAR_EVALUACIONES_COMPETENCIAS_POR_CARGO":
        try {
            $sql = "SELECT * FROM evaluacionesPorCargo WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluador);
            $statement->bindValue(2, $payload->idEvaluado);
            $statement->bindValue(3, $payload->idPeriodo);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);

        } catch (Exception $e) {
            echo "Error: $e";
        }

        break;

    case "GUARDAR_ITEM_EVALUACION_COMPETENCIAS_POR_CARGO":
        try {
            $sql = "INSERT INTO evaluacionesPorCargo (id, idEvaluador, idEvaluado, idPeriodo, idItem, calificacion, fechaEvaluacion) VALUES (?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE calificacion = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->id);
            $statement->bindValue(2, $payload->idEvaluador);
            $statement->bindValue(3, $payload->idEvaluado);
            $statement->bindValue(4, $payload->idPeriodo);
            $statement->bindValue(5, $payload->idItem);
            $statement->bindValue(6, $payload->calificacion);
            $statement->bindValue(7, $payload->fechaEvaluacion);
            $statement->bindValue(8, $payload->calificacion);
            $statement->execute();

            $object = new stdClass();
            $object->id = $database->lastInsertId();
            $object->indice = $payload->indice;

            echo json_encode($object);

        } catch (Exception $e) {
            print_r($e);
        }
        break;



    /**
     * Habilidades tecnicas
     */

    //Carga los evaluados para competencias por cargo
    case "CARGAR_EVALUADOS_PARA_HABILIDADES_TECNICAS":
        $sql = "SELECT asignaciones.idEvaluado as value, expediente.NOMBRES_APELLIDOS as label
                FROM asignaciones INNER JOIN expediente
                ON asignaciones.idEvaluado = expediente.CEDULA
                WHERE
                asignaciones.idPeriodo = ?
                AND
                asignaciones.idEvaluador = ?
                AND
                asignaciones.idTipoEvaluacion = 3;";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;



    case "CARGAR_HABILIDADES_TECNICAS":
        try {
            $sql = "SELECT id, habilidad as COMPORTAMIENTO, '' AS COMPETENCIA FROM habilidadesTecnicas";
            $statement = $database->prepare($sql);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } catch (Exception $e) {
            echo "Error: $e";
        }
        break;



    //Carga las evaluaciones (si existen) de un evaluador para un evaluado
    case "CARGAR_EVALUACIONES_HABILIDADES_TECNICAS":
        try {
            $sql = "SELECT * FROM evaluacionesHabilidadesTecnicas WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluador);
            $statement->bindValue(2, $payload->idEvaluado);
            $statement->bindValue(3, $payload->idPeriodo);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);

        } catch (Exception $e) {
            echo "Error: $e";
        }

        break;

    case "GUARDAR_ITEM_EVALUACION_HABILIDADES_TECNICAS":
        try {
            $sql = "INSERT INTO evaluacionesHabilidadesTecnicas (id, idEvaluador, idEvaluado, idPeriodo, idItem, calificacion, fechaEvaluacion) VALUES (?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE calificacion = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->id);
            $statement->bindValue(2, $payload->idEvaluador);
            $statement->bindValue(3, $payload->idEvaluado);
            $statement->bindValue(4, $payload->idPeriodo);
            $statement->bindValue(5, $payload->idItem);
            $statement->bindValue(6, $payload->calificacion);
            $statement->bindValue(7, $payload->fechaEvaluacion);
            $statement->bindValue(8, $payload->calificacion);
            $statement->execute();

            $object = new stdClass();
            $object->id = $database->lastInsertId();
            $object->indice = $payload->indice;

            echo json_encode($object);

        } catch (Exception $e) {
            print_r($e);
        }
        break;



    //Carga los evaluados para competencias por cargo
    case "CARGAR_EVALUADOS_POR_OBJETIVOS":
        $sql = "SELECT asignaciones.idEvaluado as value, expediente.NOMBRES_APELLIDOS as label
                FROM asignaciones INNER JOIN expediente
                ON asignaciones.idEvaluado = expediente.CEDULA
                WHERE
                asignaciones.idPeriodo = ?
                AND
                asignaciones.idEvaluador = ?
                AND
                asignaciones.idTipoEvaluacion = 5;";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    //Carga los evaluados para competencias por cargo 
//Revisa que los evaluados tengan al menos una evaluacion con calificacionz
    case "CARGAR_EVALUADOS_POR_CARGO_2":
        $sql = "SELECT ex.CEDULA as value, ex.NOMBRES_APELLIDOS as label
            FROM evaluacionesPorCargo ev
                INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
            WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
            GROUP BY ex.CEDULA
            ORDER BY ex.NOMBRES_APELLIDOS
     ";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;



    case "CARGAR_EVALUACIONES_POR_OBJETIVOS":
        $sql = "SELECT * FROM evaluacionesPorObjetivos WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idEvaluador);
        $statement->bindValue(2, $payload->idEvaluado);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "GUARDAR_ITEM_EVALUACION_POR_OBJETIVOS":

        try {

            $sql = "SELECT count(*) FROM evaluacionesPorObjetivos WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluador);
            $statement->bindValue(2, $payload->idEvaluado);
            $statement->bindValue(3, $payload->idPeriodo);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_BOTH);

            if ($result[0] == 0) {
                $sql = "INSERT INTO evaluacionesPorObjetivos ( idEvaluador, idEvaluado, idPeriodo, fechaHora) VALUES (?,?,?,?)";
                $statement = $database->prepare($sql);
                $statement->bindValue(1, $payload->idEvaluador);
                $statement->bindValue(2, $payload->idEvaluado);
                $statement->bindValue(3, $payload->idPeriodo);
                $statement->bindValue(4, $payload->fechaHora);
                $statement->execute();
            }

            $sql = "UPDATE evaluacionesPorObjetivos SET  objetivo1=?, objetivo2=?, objetivo3=?, objetivo4=?, ponderacion1=?, ponderacion2=?, ponderacion3=?, ponderacion4=?, calificacion1=?, calificacion2=?, calificacion3=?, calificacion4=?, fechaHora=? WHERE idEvaluador = ? AND idEvaluado = ? AND idPeriodo = ?";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->objetivo1);
            $statement->bindValue(2, $payload->objetivo2);
            $statement->bindValue(3, $payload->objetivo3);
            $statement->bindValue(4, $payload->objetivo4);
            $statement->bindValue(5, $payload->ponderacion1);
            $statement->bindValue(6, $payload->ponderacion2);
            $statement->bindValue(7, $payload->ponderacion3);
            $statement->bindValue(8, $payload->ponderacion4);
            $statement->bindValue(9, $payload->calificacion1);
            $statement->bindValue(10, $payload->calificacion2);
            $statement->bindValue(11, $payload->calificacion3);
            $statement->bindValue(12, $payload->calificacion4);
            $statement->bindValue(13, $payload->fechaHora);
            $statement->bindValue(14, $payload->idEvaluador);
            $statement->bindValue(15, $payload->idEvaluado);
            $statement->bindValue(16, $payload->idPeriodo);
            $statement->execute();
            echo "OK";



        } catch (Exception $e) {
            print_r($e);
        }

        break;


    case "CARGAR_EVALUADOS_360_ASIGNADOS_A_UN_EVALUADOR":
        try {



            $sql = "SELECT asignaciones.idEvaluado as value, expediente.NOMBRES_APELLIDOS as label
                FROM asignaciones INNER JOIN expediente
                ON asignaciones.idEvaluado = expediente.CEDULA
                WHERE
                asignaciones.idPeriodo = ?
                AND
                asignaciones.idEvaluador = ?
                AND
                asignaciones.idTipoEvaluacion = 1";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idPeriodo);
            $statement->bindValue(2, $payload->idEvaluador);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);



            echo json_encode($result);
        } catch (Exception $e) {
            echo "Error: $e";
        }
        break;

    case "CARGAR_EVALUACION_360_DE_UN_EVALUADO":
        try {

            $paquete = new stdClass();


            //Cargar auto evaluaciones
            $sql = "SELECT 
            comp.competencia, CEIL((25 * avg(ev.calificacion))) as c
                FROM
                competencias360 comp INNER JOIN evaluaciones360 ev on comp.id = ev.idItem
                WHERE
                ev.idEvaluado = ?
                AND
                ev.idEvaluador = ?
                AND
                ev.idPeriodo = ?                      
                GROUP BY
                comp.COMPETENCIA
                ORDER BY comp.COMPETENCIA
                ";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluado);
            $statement->bindValue(2, $payload->idEvaluado);
            $statement->bindValue(3, $payload->idPeriodo);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);


            //Cargar la evaluacion que le hace el jefe
            $sql = "SELECT 
                comp.competencia,  CEIL((25 * avg(ev.calificacion))) as c
                FROM
                competencias360 comp
                INNER JOIN
                evaluaciones360 ev on comp.id = ev.idItem
                INNER JOIN
                expediente ex on ex.CEDULA = ev.idEvaluado
                WHERE
                ev.idEvaluado = ?
                AND
                ev.idEvaluador = ex.CEDULA_LIDER
                AND
                ev.idPeriodo = ?                      
                GROUP BY
                comp.COMPETENCIA
                ORDER BY comp.COMPETENCIA
                ";
            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluado);
            $statement->bindValue(2, $payload->idPeriodo);
            $statement->execute();
            $result2 = $statement->fetchAll(PDO::FETCH_ASSOC);

            //cargar la evaluacion que hacen los subordinados
            $sql = "SELECT 
                comp.competencia,  CEIL((25 * avg(ev.calificacion))) as c
                FROM
                competencias360 comp
                INNER JOIN
                evaluaciones360 ev on comp.id = ev.idItem
                INNER JOIN
                expediente ex on ex.CEDULA_LIDER = ev.idEvaluado
                WHERE
                ev.idEvaluado = ?
                AND
                ev.idEvaluador = ex.CEDULA
                AND
                ev.idPeriodo = ?                      
                GROUP BY
                comp.COMPETENCIA
                ORDER BY comp.COMPETENCIA
                ";


            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluado);
            $statement->bindValue(2, $payload->idPeriodo);
            $statement->execute();
            $result3 = $statement->fetchAll(PDO::FETCH_ASSOC);

            //Cargamos los pares
            $sql = "SELECT 
                comp.competencia,  CEIL((25 * avg(ev.calificacion))) as c
                FROM
                competencias360 comp
                INNER JOIN
                evaluaciones360 ev on comp.id = ev.idItem
                INNER JOIN
                expediente ex1 on ex1.CEDULA = ev.idEvaluado
                 INNER JOIN
                expediente ex2 on ex2.CEDULA = ev.idEvaluador
                
                WHERE
                ev.idEvaluado = ?
                AND
                ev.idEvaluador <> ev.idEvaluado -- no es autoevaluacion
                AND
                ex1.CEDULA_LIDER <> ex2.CEDULA -- no es jefe
                AND
                ex2.CEDULA_LIDER <> ex1.CEDULA -- no es subordinado
                AND
                ev.idPeriodo = ?                      
                GROUP BY
                comp.COMPETENCIA
                ORDER BY comp.COMPETENCIA
                ";

            $statement = $database->prepare($sql);
            $statement->bindValue(1, $payload->idEvaluado);
            $statement->bindValue(2, $payload->idPeriodo);
            $statement->execute();
            $result4 = $statement->fetchAll(PDO::FETCH_ASSOC);

            //Tomar solo las competencias
            $sql = "SELECT distinct competencia FROM competencias360 order by competencia";
            $statement = $database->prepare($sql);
            $statement->execute();
            $result5 = $statement->fetchAll(PDO::FETCH_ASSOC);


            $paquete->autoevaluacion = $result;
            $paquete->jefe = $result2;
            $paquete->colaboradores = $result3;
            $paquete->pares = $result4;
            $paquete->competencias = $result5;


            echo json_encode($paquete);
        } catch (\Throwable $th) {
            //throw $th;
        }
        break;




    case "CARGAR_EVALUACIONES_360_POR_COMPANIAS_Y_EVALUADORES":

        $sql =
            "SELECT t.COMPANIA,
            SUM(t.autoevaluacion) as autoevaluacion,
            SUM(t.jefe) as jefe,
            SUM(t.colaboradores) as colaboradores,
            SUM(t.pares) as pares,
            SUM(
            t.autoevaluacion + t.jefe + t.colaboradores + t.pares
            ) /(
            if(sum(t.autoevaluacion) > 0, 1, 0) + if(sum(t.jefe) > 0, 1, 0) + if(sum(t.colaboradores) > 0, 1, 0) + if(sum(t.pares) > 0, 1, 0)
            ) as promedio
            FROM (
            -- AUTOEVALUACION
            SELECT ex1.COMPANIA,
            ROUND(25 * AVG(ev.calificacion)) as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            0 as pares
            FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
            WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA = ex2.CEDULA -- autoevaluacion
            GROUP BY ex1.COMPANIA
            UNION
            -- JEFE
            SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            ROUND(25 * AVG(ev.calificacion)) as jefe,
            0 as colaboradores,
            0 as pares
            FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
            WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA_LIDER = ex2.CEDULA -- jefe
            GROUP BY ex1.COMPANIA
            UNION
            -- COLABORADORES    
            SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            0 as jefe,
            ROUND(25 * AVG(ev.calificacion)) as colaboradores,
            0 as pares
            FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
            WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA = ex2.CEDULA_LIDER -- colaboradores
            GROUP BY ex1.COMPANIA
            UNION
            -- PARES
            SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            ROUND(25 * AVG(ev.calificacion)) as pares
            FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
            WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA <> ex2.CEDULA_LIDER -- no es subordinado
            AND ex1.CEDULA_LIDER <> ex2.CEDULA -- no es el jefe
            AND ex1.CEDULA <> ex2.CEDULA -- no es auto
            GROUP BY ex1.COMPANIA
            ) as t
            GROUP BY COMPANIA;
            ";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idPeriodo);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->bindValue(4, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    case "CARGAR_360_POR_COMPANIAS_Y_COMPETENCIAS":

        //Cargamos un listado de comopanias
        $sql1 = "SELECT DISTINCT COMPANIA FROM expediente;";
        $statement = $database->prepare($sql1);
        $statement->execute();
        $companias = $statement->fetchAll(PDO::FETCH_ASSOC);


        //cargamos un listado de competencias
        $sql2 = "SELECT DISTINCT COMPETENCIA FROM competencias360";
        $statement = $database->prepare($sql2);
        $statement->execute();
        $competencias = $statement->fetchAll(PDO::FETCH_ASSOC);


        $arrayData = [];
        //En un bucle vamos creando las filas del objeto con los datos
        foreach ($companias as $k1 => $compania) {
            $compania = $compania["COMPANIA"];
            $data = [$compania];
            foreach ($competencias as $k2 => $competencia) {
                $competencia = $competencia["COMPETENCIA"];

                $sql3 = "SELECT round(25 * avg(ev.calificacion)) as C
                    FROM evaluaciones360 ev
                    INNER JOIN competencias360 comp on comp.id = ev.idItem
                    INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
                    INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
                    WHERE ev.idPeriodo = ?
                    AND ev.calificacion > 0
                    AND comp.COMPETENCIA = ?
                    AND ex1.COMPANIA = ?";

                $statement = $database->prepare($sql3);
                $statement->bindValue(1, $payload->idPeriodo);
                $statement->bindValue(2, $competencia);
                $statement->bindValue(3, $compania);
                $statement->execute();
                $result = $statement->fetch(PDO::FETCH_ASSOC);

                $data[] = $result["C"];

            }
            $arrayData[] = $data;

        }



        $packet = [
            "competencias" => $competencias,
            "companias" => $companias,
            "arrayData" => $arrayData
        ];

        echo json_encode($packet);

        break;


    case "CARGAR_UNIDADES_DE_NEGOCIOS":

        $sql = "SELECT DISTINCT UNIDAD_DE_NEGOCIO AS label, UNIDAD_DE_NEGOCIO AS value FROM expediente WHERE UNIDAD_DE_NEGOCIO IS NOT NULL ORDER BY UNIDAD_DE_NEGOCIO ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_DEPARTAMENTOS_POR_UNIDAD_NEGOCIO":

        $sql = "SELECT DISTINCT DEPARTAMENTO AS label, DEPARTAMENTO AS value FROM expediente WHERE  UNIDAD_DE_NEGOCIO = ? ORDER BY DEPARTAMENTO ASC";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->unidadNegocio);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_EVALUADORES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTO":
        $sql = "SELECT T.DEPARTAMENTO,
        sum(T.autoevaluacion) as autoevaluacion,
        sum(T.jefe) as jefe,
        sum(T.colaboradores) as colaboradores,
        sum(T.pares) as pares,
        (
            sum(T.autoevaluacion) + sum(T.jefe) + sum(T.colaboradores) + sum(T.pares)
        ) / (
            if(sum(T.autoevaluacion) > 0, 1, 0) + if(sum(T.jefe) > 0, 1, 0) + if(sum(T.colaboradores) > 0, 1, 0) + if(sum(T.pares) > 0, 1, 0)
        ) as promedio
        FROM (
            SELECT ex1.DEPARTAMENTO,
                ROUND(25 * AVG(ev.calificacion)) as autoevaluacion,
                0 as jefe,
                0 as colaboradores,
                0 as pares
            FROM expediente ex1
                INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
                INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
            WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
                AND ex1.UNIDAD_DE_NEGOCIO = ? 
                AND ex1.CEDULA = ex2.CEDULA -- autoevaluacion
            GROUP BY ex1.DEPARTAMENTO
            UNION
            SELECT ex1.DEPARTAMENTO,
                0 as autoevaluacion,
                ROUND(25 * AVG(ev.calificacion)) as jefe,
                0 as colaboradores,
                0 as pares
            FROM expediente ex1
                INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
                INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
            WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
                AND ex1.UNIDAD_DE_NEGOCIO = ?
                AND ex1.CEDULA_LIDER = ex2.CEDULA -- JEFE
            GROUP BY ex1.DEPARTAMENTO
            UNION
            SELECT ex1.DEPARTAMENTO,
                0 as autoevaluacion,
                0 as jefe,
                ROUND(25 * AVG(ev.calificacion)) as colaboradores,
                0 as pares
            FROM expediente ex1
                INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
                INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
            WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
                AND ex1.UNIDAD_DE_NEGOCIO = ? 
                AND ex1.CEDULA = ex2.CEDULA_LIDER -- COLABORADORES
            GROUP BY ex1.DEPARTAMENTO
            UNION
            SELECT ex1.DEPARTAMENTO,
                0 as autoevaluacion,
                0 as jefe,
                0 as colaboradores,
                ROUND(25 * AVG(ev.calificacion)) as pares
            FROM expediente ex1
                INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
                INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
            WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
                AND ex1.UNIDAD_DE_NEGOCIO = ? 
                AND ex1.CEDULA <> ex2.CEDULA -- NO ES autoevaluacion
                AND ex1.CEDULA_LIDER <> ex2.CEDULA -- NO ES JEFE
                AND ex1.CEDULA <> ex2.CEDULA_LIDER -- NO ES COLABORADORES
            GROUP BY ex1.DEPARTAMENTO
        ) as T
        GROUP BY T.DEPARTAMENTO
        ORDER BY promedio DESC;
            ";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->unidadNegocio);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->bindValue(4, $payload->unidadNegocio);
        $statement->bindValue(5, $payload->idPeriodo);
        $statement->bindValue(6, $payload->unidadNegocio);
        $statement->bindValue(7, $payload->idPeriodo);
        $statement->bindValue(8, $payload->unidadNegocio);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);

        break;

    case "CARGAR_EVALUACIONES_360_POR_UNIDAD_DE_NEGOCIO_Y_DEPARTAMENTOS_Y_COMPETENCIAS":

        $output = [];

        //Obtenemos las competencias
        $sql = "SELECT DISTINCT competencia FROM competencias360 order by competencia ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $competencias = $statement->fetchAll(PDO::FETCH_ASSOC);

        //Obtenemos los departamentos de la unidad de unidadNegocio
        $sql = "SELECT DISTINCT departamento FROM expediente WHERE unidad_de_negocio = ? ORDER BY departamento ASC";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->unidadNegocio);
        $statement->execute();
        $departamentos = $statement->fetchAll(PDO::FETCH_ASSOC);

        //Recorremos cada detarmento
        foreach ($departamentos as $departamento) {

            $rows = (object) [];
            $rows->DEPARTAMENTO = $departamento["departamento"];

            //Recorremos cada competencia
            foreach ($competencias as $competencia) {

                //Obtenemos el promedio por competencia y departamento
                $sql = "SELECT
                        round(25 * avg(ev.calificacion)) as c
                        FROM evaluaciones360 ev
                            INNER JOIN competencias360 comp on ev.idItem = comp.id
                            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
                        WHERE ev.calificacion > 0
                            AND ev.idPeriodo = ?
                            AND ex1.UNIDAD_DE_NEGOCIO = ?
                            AND ex1.DEPARTAMENTO = ?
                        GROUP BY ex1.departamento, comp.COMPETENCIA";

                $statement = $database->prepare($sql);
                $statement->bindValue(1, $payload->idPeriodo);
                $statement->bindValue(2, $payload->unidadNegocio);
                $statement->bindValue(3, $departamento["departamento"]);
                $statement->execute();
                $fields = $statement->fetchAll(PDO::FETCH_ASSOC);


                for ($i = 0; $i < count($fields); $i++) {
                    $rows->{"p$i"} = $fields[$i]["c"];
                }

            }

            $output[] = $rows;

        }

        echo json_encode($output);
        break;

    //Devuelve la competencia, el tipo de competencia y la calificación de un emleado
    //En la evaluación de competencias por cargo
    case "CARGAR_CALIFICACIONES_COMPETENCIAS_POR_CARGO_POR_EMPLEADO":
        $sql = "SELECT cpc.COMPETENCIA,
                cpc.TIPO_COMPETENCIA,
                round(25 * avg(ev.calificacion)) as CALIFICACION
            FROM expediente ex
                INNER JOIN evaluacionesPorCargo ev ON ex.CEDULA = ev.idEvaluado
                INNER JOIN competenciasPorCargos cpc ON ev.idItem = cpc.id
            WHERE ev.idEvaluado = ?
                AND ev.idPeriodo = ?
                AND ev.calificacion > 0
                GROUP BY
                cpc.COMPETENCIA
                ORDER BY cpc.id
        ";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->CEDULA);
        $statement->bindValue(2, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    case "CARGAR_EVALUACION_POR_CARGO_POR_UNIDAD_DE_NEGOCIO":
        $sql = "SELECT ex.UNIDAD_DE_NEGOCIO,
                round(25 * avg(ev.calificacion)) as calificacion
                FROM evaluacionesPorCargo ev
                INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
                WHERE ev.idPeriodo = ?
                AND ev.calificacion > 0
                GROUP BY ex.UNIDAD_DE_NEGOCIO
                ORDER BY calificacion DESC";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);


        break;

    case "CARGAR_EVALUACIONES_POR_CARGOS_POR_UNIDAD_DE_NEGOCIOS_Y_DEPARTAMENTOS":
        $sql = "SELECT ex.UNIDAD_DE_NEGOCIO,
            ex.DEPARTAMENTO,
            round(25 * avg(ev.calificacion)) as calificacion,
            ex.NOMBRES_APELLIDOS as trabajador
            FROM evaluacionesPorCargo ev
            INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
            WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            GROUP BY trabajador
            HAVING calificacion > 0
            ORDER BY  ex.DEPARTAMENTO, calificacion DESC";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);

        break;

    case "CARGAR_EVALUACION_POR_CARGO_PROMEDIO_EMPRESAS":
        $sql = "SELECT CEIL(25 * AVG(ev.calificacion)) as calificacion,
                    ex.COMPANIA
                    FROM evaluacionesPorCargo ev
                    INNER JOIN expediente ex ON ev.idEvaluado = ex.CEDULA
                    WHERE ev.idPeriodo = ?
                    AND ev.calificacion > 0
                    GROUP BY ex.COMPANIA;";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_TRABAJADORES_CON_EVALUACION_POR_OBJETIVOS":
        $sql = "SELECT
                ex.NOMBRES_APELLIDOS as label,
                ex.CEDULA as value
                FROM expediente ex
                INNER JOIN evaluacionesPorObjetivos ev ON ex.CEDULA = ev.idEvaluado
                WHERE ev.idPeriodo = ?
                AND ev.idEvaluador = ?
                GROUP BY ex.NOMBRES_APELLIDOS";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_CALIFICACIONES_OBJETIVOS_POR_TRABAJADOR":
        $sql = "SELECT objetivo1,
                objetivo2,
                objetivo3,
                objetivo4,
                ponderacion1,
                ponderacion2,
                ponderacion3,
                ponderacion4,
                calificacion1,
                calificacion2,
                calificacion3,
                calificacion4
                FROM evaluacionesPorObjetivos
                WHERE idEvaluado = ?
                AND idEvaluador = ?
                AND idPeriodo = ?";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idEvaluado);
        $statement->bindValue(2, $payload->idEvaluador);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case "CARGAR_PROMEDIO_POR_EMPRESA_EVALUACIONES_OBJETIVOS":
        $sql = "SELECT ex.COMPANIA as empresa,
            (
            ((avg(calificacion1) * 25) * (ponderacion1 / 100)) + ((avg(calificacion2) * 25) * (ponderacion2 / 100)) + ((avg(calificacion3) * 25) * (ponderacion3 / 100)) + ((avg(calificacion4) * 25) * (ponderacion4 / 100))
            ) AS promedio
            FROM evaluacionesPorObjetivos ev
            INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
            AND ev.idPeriodo = ?
            GROUP BY ex.COMPANIA";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;


    case "CARGAR_EVALUACION_OBJETIVOS_POR_UNIDAD_DE_NEGOCIO":
        $sql = "SELECT ex.UNIDAD_DE_NEGOCIO as UNIDAD_DE_NEGOCIO,
            (
            ((avg(calificacion1) * 25) * (ponderacion1 / 100)) + ((avg(calificacion2) * 25) * (ponderacion2 / 100)) + ((avg(calificacion3) * 25) * (ponderacion3 / 100)) + ((avg(calificacion4) * 25) * (ponderacion4 / 100))
            ) AS promedio
            FROM evaluacionesPorObjetivos ev
            INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
            AND ev.idPeriodo = ?
            GROUP BY ex.UNIDAD_DE_NEGOCIO
            ORDER BY promedio DESC";
        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);


        break;




    case "CARGAR_EVALUACIONES_POR_OBJETIVOS_POR_UNIDAD_DE_NEGOCIOS_Y_DEPARTAMENTOS":
        $sql = "SELECT ex.UNIDAD_DE_NEGOCIO,
            ex.DEPARTAMENTO,
             round(
            ((avg(calificacion1) * 25) * (ponderacion1 / 100)) + ((avg(calificacion2) * 25) * (ponderacion2 / 100)) + ((avg(calificacion3) * 25) * (ponderacion3 / 100)) + ((avg(calificacion4) * 25) * (ponderacion4 / 100))
            ) as calificacion,
            ex.NOMBRES_APELLIDOS as trabajador
            FROM evaluacionesPorObjetivos ev
            INNER JOIN expediente ex on ev.idEvaluado = ex.CEDULA
            WHERE ev.idPeriodo = ?
           
            GROUP BY trabajador
            HAVING calificacion > 0
            ORDER BY  ex.DEPARTAMENTO, calificacion DESC";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);

        break;


    case "CARGAR_EVALUADORES_360_COMITE":

        $sql = "SELECT T.NOMBRES_APELLIDOS,
        T.DEPARTAMENTO,
        sum(T.autoevaluacion) as autoevaluacion,
        sum(T.jefe) as jefe,
        sum(T.colaboradores) as colaboradores,
        sum(T.pares) as pares,
        (
        sum(T.autoevaluacion) + sum(T.jefe) + sum(T.colaboradores) + sum(T.pares)
        ) / (
        if(sum(T.autoevaluacion) > 0, 1, 0) + if(sum(T.jefe) > 0, 1, 0) + if(sum(T.colaboradores) > 0, 1, 0) + if(sum(T.pares) > 0, 1, 0)
        ) as promedio
        FROM (
        SELECT ex1.NOMBRES_APELLIDOS, ex1.DEPARTAMENTO,
            ROUND(25 * AVG(ev.calificacion)) as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            0 as pares
        FROM expediente ex1
            INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
            INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.ACTIVO = 1
            AND ex1.COMITE = 1
            AND ex1.CEDULA = ex2.CEDULA -- autoevaluacion
        GROUP BY ex1.NOMBRES_APELLIDOS
        UNION
        SELECT ex1.NOMBRES_APELLIDOS,ex1.DEPARTAMENTO,
            0 as autoevaluacion,
            ROUND(25 * AVG(ev.calificacion)) as jefe,
            0 as colaboradores,
            0 as pares
        FROM expediente ex1
            INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
            INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.ACTIVO = 1
            AND ex1.COMITE = 1
            AND ex1.CEDULA_LIDER = ex2.CEDULA -- JEFE
        GROUP BY ex1.NOMBRES_APELLIDOS
        UNION
        SELECT ex1.NOMBRES_APELLIDOS,ex1.DEPARTAMENTO,
            0 as autoevaluacion,
            0 as jefe,
            ROUND(25 * AVG(ev.calificacion)) as colaboradores,
            0 as pares
        FROM expediente ex1
            INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
            INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.ACTIVO = 1
            AND ex1.COMITE = 1
            AND ex1.CEDULA = ex2.CEDULA_LIDER -- COLABORADORES
        GROUP BY ex1.NOMBRES_APELLIDOS
        UNION
        SELECT ex1.NOMBRES_APELLIDOS,ex1.DEPARTAMENTO,
            0 as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            ROUND(25 * AVG(ev.calificacion)) as pares
        FROM expediente ex1
            INNER JOIN evaluaciones360 ev ON ex1.CEDULA = ev.idEvaluado
            INNER JOIN expediente ex2 ON ex2.CEDULA = ev.idEvaluador
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.ACTIVO = 1
            AND ex1.COMITE = 1
            AND ex1.CEDULA <> ex2.CEDULA -- NO ES autoevaluacion
            AND ex1.CEDULA_LIDER <> ex2.CEDULA -- NO ES JEFE
            AND ex1.CEDULA <> ex2.CEDULA_LIDER -- NO ES COLABORADORES
        GROUP BY ex1.NOMBRES_APELLIDOS
        ) as T
        GROUP BY T.NOMBRES_APELLIDOS
        ORDER BY promedio DESC;
            ";

        $statement = $database->prepare($sql);
        $statement->bindValue(1, $payload->idPeriodo);
        $statement->bindValue(2, $payload->idPeriodo);
        $statement->bindValue(3, $payload->idPeriodo);
        $statement->bindValue(4, $payload->idPeriodo);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);

        break;


    case "CARGAR_EVALUACIONES_COMITE_POR_COMPETENCIA":

        //Obtenemos las competencias
        $sql = "SELECT DISTINCT competencia FROM competencias360";
        $statement = $database->prepare($sql);
        $statement->execute();
        $competencias = $statement->fetchAll(PDO::FETCH_ASSOC);

        //Obtenemos los trabajadores
        $sql = "SELECT NOMBRES_APELLIDOS FROM expediente WHERE COMITE = 1 AND ACTIVO = 1 ORDER BY NOMBRES_APELLIDOS ASC";
        $statement = $database->prepare($sql);
        $statement->execute();
        $trabajadores = $statement->fetchAll(PDO::FETCH_ASSOC);

        //Filas
        $rows = [];



        //Recorremos cada trabajador
        foreach ($trabajadores as $trabajador) {
            $row = [];
            $row["NOMBRES_APELLIDOS"] = $trabajador["NOMBRES_APELLIDOS"];


            //Procesamos cada competencia
            foreach ($competencias as $competencia) {

                $sql = "SELECT
                ROUND(25 * avg(ev.calificacion)) as calificacion
                FROM 
                expediente ex INNER JOIN evaluaciones360 ev on ex.CEDULA = ev.idEvaluado

                WHERE ev.idPeriodo = ?
                AND ex.NOMBRES_APELLIDOS = ?
                and ex.COMITE = 1
                and ex.ACTIVO = 1
                and ev.calificacion > 0
                and ev.idItem in (SELECT id FROM competencias360 where COMPETENCIA = ?)

                GROUP BY
                ex.NOMBRES_APELLIDOS
            ";

                $statement = $database->prepare($sql);
                $statement->bindValue(1, $payload->idPeriodo);
                $statement->bindValue(2, $trabajador["NOMBRES_APELLIDOS"]);
                $statement->bindValue(3, $competencia["competencia"]);
                $statement->execute();
                $result = $statement->fetch(PDO::FETCH_ASSOC);
                $row["calificaciones"][] = $result["calificacion"];


            }

            $rows[] = $row;

        }

        $data = [];
        $data["competencias"] = $competencias;
        //$data["trabajadores"] = $trabajadores;
        $data["calificaciones"] = $rows;
        echo json_encode($data);


        break;





}