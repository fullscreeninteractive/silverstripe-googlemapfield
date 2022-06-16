<?php

namespace BetterBrief;

use SilverStripe\UserForms\Model\EditableFormField;

class EditableGoogleMapField extends EditableFormField
{
    public function getFormField()
    {
        $field = new GoogleMapField($this->Name, $this->Title ?: false, $this->Default);

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
