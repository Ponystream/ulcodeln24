<?php

// Le namespace pour etre importe tout seul pas l'autoloader
namespace greatgrandnancy\api\controller;

use greatgrandnancy\common\model\EquipementsServices;

class EquipementsServicesController extends AbstractController
{
    public function getAllEquipment($data)
    {

        $router = $this->app->getContainer()->get('router');

        if (isset($data['ville'])) {
            $ville = [];
            // parser $data['villes']
            $parsed = urldecode($data['ville']);
            $explode = explode(';', $parsed);
            // foreach sur le resultat
            $equipment = EquipementsServices::select('*');

            foreach ($explode as $e) {
                $equipment->orWhere('LIBGEO', '=', $e);
            }
            $query = $equipment->get();

            if (empty($query[0])) {

                $res = ['codeErreur' => 404,
                    'messageErreur' => "La ressource demandée n'a pas été trouvée",
                    'ressourceDemandee' => $router->pathFor('getEquipmentsByCity', []) . '?ville=' . $data['ville']];
                $encoded = json_encode($res);

                //Ecriture du header
                $response = $this->jsonHeader($this->response, 'Content-Type', 'application/json');
                $response = $this->Status($response, 404);
                $response = $this->Write($response, $encoded);

                return $response;
            }

            foreach ($query as $q) {
                $res[] = ['equipement' => $q, 'links' => ['self' => ['href' => $router->pathFor('getEquipmentById', ['id' => $q->CODGEO])]]];
            }

            $tab = ['equipements' => $res, 'links' => []];
            $encoded = json_encode($tab);

            $response = $this->jsonHeader($this->response, 'Content-Type', 'application/json');
            $response = $this->Status($response, 200);
            $response = $this->Write($response, $encoded);

            return $response;
        }
    }

    public function getEquipmentById($id)
    {
        $router = $this->app->getContainer()->get('router');

        $equipment = EquipementsServices::find($id);

        if (empty($equipment)) {

            $res = ['codeErreur' => 404,
                'messageErreur' => "La ressource demandée n'a pas été trouvée",
                'ressourceDemandee' => $router->pathFor('getEquipmentById', ['id' => $id])];
            $encoded = json_encode($res);

            //Ecriture du header
            $response = $this->jsonHeader($this->response, 'Content-Type', 'application/json');
            $response = $this->Status($response, 404);
            $response = $this->Write($response, $encoded);

            return $response;
        }

        $res = ['equipement' => $equipment, 'Links' => []];

        $encoded = json_encode($res);

        $response = $this->jsonHeader($this->response, 'Content-Type', 'application/json');
        $response = $this->Status($response, 200);
        $response = $this->Write($response, $encoded);

        return $response;
    }
}