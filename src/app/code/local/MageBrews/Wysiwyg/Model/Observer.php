<?php

class MageBrews_Wysiwyg_Model_Observer {


    public function test(Varien_Event_Observer $observer)
    {
        $config = $observer->getEvent()->getConfig();

        $settings = Mage::getModel('magebrews_wysiwyg/config')->getPluginSettings($config);
        $config->addData($settings);

        return $this;
    }
}