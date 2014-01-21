<?php

class MageBrews_Wysiwyg_Model_Config extends Varien_Object
{

    public function getPluginSettings($config)
    {

        $codemirrorWysiwygPlugin = array(array('name' => 'codemagic',
            'src' => Mage::getBaseUrl('js').'tiny_mce/plugins/codemagic/editor_plugin.js',
        ));

        $configPlugins = $config->getData('plugins');
        $variableConfig['plugins'] = array_merge($codemirrorWysiwygPlugin, $configPlugins);

        return $variableConfig;
    }
}