<?php

class Ak_Wysiwyg_Model_Observer {


    public function test(Varien_Event_Observer $observer)
    {
        $config = $observer->getEvent()->getConfig();

        $settings = Mage::getModel('ak_wysiwyg/config')->getPluginSettings($config);
        $config->addData($settings);

        return $this;
    }
}