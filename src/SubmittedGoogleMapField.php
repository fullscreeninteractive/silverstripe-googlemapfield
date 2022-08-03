<?php

namespace BetterBrief;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;

class SubmittedGoogleMapField extends SubmittedFormField
{
    /**
     * Generate a formatted value for the reports and email notifications.
     * Converts new lines (which are stored in the database text field) as
     * <brs> so they will output as newlines in the reports.
     *
     * @return DBField
     */
    public function getFormattedValue()
    {
        if ($this->Value) {
            $data = json_decode($this->Value);

            return sprintf('%s (%s, %s)', $data->Search, $data->Latitude, $data->Longitude);
        }

        return '';
    }

    /**
     * Return the value of this submitted form field suitable for inclusion
     * into the CSV
     *
     * @return DBField
     */
    public function getExportValue()
    {
        return $this->getFormattedValue();
    }


    public function getSearchValue()
    {
        if ($this->Value) {
            $data = json_decode($this->Value);

            return $data->Search;
        }

        return '';
    }


    /**
     *
     */
    public function getLongitude()
    {
        if ($this->Value) {
            $data = json_decode($this->Value);

            return $data->Longitude;
        }

        return '';
    }

    /**
     *
     */
    public function getLatitude()
    {
        if ($this->Value) {
            $data = json_decode($this->Value);

            return $data->Latitude;
        }

        return '';
    }
}
