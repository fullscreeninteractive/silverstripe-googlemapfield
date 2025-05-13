<?php

namespace BetterBrief;

use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\UserForms\Model\EditableFormField;

class EditableGoogleMapField extends EditableFormField
{
    private static $singular_name = 'Google Map Field';

    private static $plural_name = 'Google Map Fields';

    private static $db = [
        'DefaultLat' => 'Float',
        'DefaultLng' => 'Float',
        'RestrictToCountry' => 'Varchar(255)',
        'RestrictToTypes' => 'Varchar(255)',
        'Zoom' => 'Int',
    ];

    private static $table_name = 'EditableGoogleMapField';


    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->removeByName('Default');
            $fields->addFieldsToTab(
                'Root.Main',
                [
                    FieldGroup::create([
                        TextField::create('DefaultLat', _t(__CLASS__ . '.DEFAULT_LAT', 'Default Latitude'))
                            ->setDescription(_t(__CLASS__ . '.DEFAULT_LAT_DESCRIPTION', 'The default latitude for the map')),
                        TextField::create('DefaultLng', _t(__CLASS__ . '.DEFAULT_LNG', 'Default Longitude'))
                            ->setDescription(_t(__CLASS__ . '.DEFAULT_LNG_DESCRIPTION', 'The default longitude for the map'))
                    ]),
                    TextField::create('RestrictToCountry', _t(__CLASS__ . '.RESTRICT_TO_COUNTRY', 'Restrict to Country'))
                        ->setDescription(_t(__CLASS__ . '.RESTRICT_TO_COUNTRY_DESCRIPTION', 'Restrict the map to a specific country (ISO 3166-1 alpha-2 code), comma-separated list of countries')),
                    TextField::create('RestrictToTypes', _t(__CLASS__ . '.RESTRICT_TO_TYPES', 'Restrict to Types'))
                        ->setDescription(_t(__CLASS__ . '.RESTRICT_TO_TYPES_DESCRIPTION', 'Restrict the map to specific types (comma-separated list)')),
                    TextField::create('Zoom', _t(__CLASS__ . '.ZOOM', 'Zoom Level'))
                        ->setDescription(_t(__CLASS__ . '.ZOOM_DESCRIPTION', 'The default zoom level for the map')),
                ]
            );
        });
        return parent::getCMSFields();
    }

    public function getFormField()
    {
        $field = new GoogleMapField($this->Name, $this->Title ?: false, null, [
            'Latitude' => $this->DefaultLat ?: 0,
            'Longitude' => $this->DefaultLng ?: 0,
            'Zoom' => $this->Zoom ?: 0
        ]);

        if ($this->RestrictToCountry) {
            $field->setRestrictToCountry($this->RestrictToCountry);
        }

        if ($this->RestrictToTypes) {
            $field->setRestrictToTypes($this->RestrictToTypes);
        }

        $this->doUpdateFormField($field);

        return $field;
    }


    public function getValueFromData($data)
    {
        return (isset($data[$this->Name])) ? json_encode($data[$this->Name]) : '';
    }


    public function getSubmittedFormField(): SubmittedGoogleMapField
    {
        return SubmittedGoogleMapField::create();
    }
}
