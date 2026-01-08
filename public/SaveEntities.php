<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    return true;
}

$configFile = __DIR__ . '/entityConfig.json';

function readConfig()
{
    global $configFile;
    if (file_exists($configFile)) {
        $content = file_get_contents($configFile);
        return json_decode($content, true) ?: [];
    }
    return [];
}

function writeConfig($config)
{
    global $configFile;
    $json = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($configFile, $json) !== false;
}

function getEntityConfig($entityName)
{
    $config = readConfig();
    return $config[$entityName] ?? null;
}

function saveEntityConfig($entityName, $entityConfig)
{
    $config = readConfig();
    $config[$entityName] = $entityConfig;
    return writeConfig($config);
}

function deleteEntityConfig($entityName)
{
    $config = readConfig();
    if (isset($config[$entityName])) {
        unset($config[$entityName]);
        return writeConfig($config);
    }
    return false;
}

function listEntities()
{
    $config = readConfig();
    return array_keys($config);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$entity = $_GET['entity'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'list') {
            // Получить список всех сущностей
            echo json_encode(['entities' => listEntities()]);
        } elseif ($action === 'get' && $entity) {
            // Получить конфигурацию конкретной сущности
            $config = getEntityConfig($entity);
            if ($config) {
                echo json_encode(['entity' => $entity, 'config' => $config]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Entity not found']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action or entity']);
        }
        break;

    case 'POST':
        if ($action === 'create' && $entity) {
            // Создать новую сущность
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data && isset($data['config'])) {
                $result = saveEntityConfig($entity, $data['config']);
                if ($result) {
                    echo json_encode(['success' => true, 'message' => 'Entity created']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to save entity']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data']);
            }
        } elseif ($action === 'update' && $entity) {
            // Обновить существующую сущность
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data && isset($data['config'])) {
                $result = saveEntityConfig($entity, $data['config']);
                if ($result) {
                    echo json_encode(['success' => true, 'message' => 'Entity updated']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update entity']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action or entity']);
        }
        break;

    case 'DELETE':
        if ($action === 'delete' && $entity) {
            // Удалить сущность
            $result = deleteEntityConfig($entity);
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Entity deleted']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Entity not found']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action or entity']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>