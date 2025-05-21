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
            $sql = "SELECT NOMBRES_APELLIDOS, CEDULA, COMPANIA, EMAIL, PIN FROM expediente WHERE email = :email AND pin  = :pin";
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




}