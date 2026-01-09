<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    return true;
}

define('CONFIG_FILE', __DIR__ . '/public/entityConfig.json');
define('SETTINGS_FILE', __DIR__ . '/public/settings.json');

function readConfig()
{
    if (!file_exists(CONFIG_FILE)) {
        return [];
    }
    $content = file_get_contents(CONFIG_FILE);
    return json_decode($content, true) ?: [];
}

function writeConfig($config)
{
    $dir = dirname(CONFIG_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(CONFIG_FILE, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function readSettings()
{
    if (!file_exists(SETTINGS_FILE)) {
        return [];
    }
    $content = file_get_contents(SETTINGS_FILE);
    return json_decode($content, true) ?: [];
}

function writeSettings($settings)
{
    $dir = dirname(SETTINGS_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(SETTINGS_FILE, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? '';
$entity = $_GET['entity'] ?? '';

switch ($action) {
    case 'list':
        $config = readConfig();
        echo json_encode(['entities' => $config]);
        break;

    case 'get':
        $config = readConfig();
        $entityConfig = $config[$entity] ?? null;
        echo json_encode(['config' => $entityConfig]);
        break;

    case 'create':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $config = readConfig();
        if (isset($config[$entity])) {
            http_response_code(409);
            echo json_encode(['error' => 'Entity already exists']);
            break;
        }
        $config[$entity] = $input['config'] ?? [];
        writeConfig($config);
        echo json_encode(['success' => true, 'config' => $config[$entity]]);
        break;

    case 'update':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $config = readConfig();
        if (!isset($config[$entity])) {
            http_response_code(404);
            echo json_encode(['error' => 'Entity not found']);
            break;
        }
        $config[$entity] = $input['config'] ?? [];
        writeConfig($config);
        echo json_encode(['success' => true, 'config' => $config[$entity]]);
        break;

    case 'delete':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        $config = readConfig();
        if (!isset($config[$entity])) {
            http_response_code(404);
            echo json_encode(['error' => 'Entity not found']);
            break;
        }
        unset($config[$entity]);
        writeConfig($config);
        echo json_encode(['success' => true]);
        break;

    case 'save_settings':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $settings = [
            'apiUrl' => $input['apiUrl'] ?? '',
            'apiDomain' => $input['apiDomain'] ?? '',
            'charts' => $input['charts'] ?? [],
        ];
        writeSettings($settings);
        echo json_encode(['success' => true]);
        break;

    case 'load_settings':
        $settings = readSettings();
        echo json_encode(['settings' => $settings]);
        break;
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>