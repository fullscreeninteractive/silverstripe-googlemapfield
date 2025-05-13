<div class="googlemapfield $extraClass" $AttributesHTML <% if $RestrictToCountry %>data-restrict-country="{$RestrictToCountry}"<% end_if %> <% if $RestrictToTypes %>data-restrict-types="{$RestrictToTypes}"<% end_if %>>
    <div class="googlemapfield-controls">
        <% loop $FieldList %>
            $Field
        <% end_loop %>
    </div>

    <div class="googlemapfield-map"></div>
    <div class="googlemapfield-updateaddress">
        <input type="checkbox" class="googlemapfield-toggle" id="updateaddress-{$ID}" />
        <label for="updateaddress-{$ID}">
            Update address as you drag the marker?
        </label>
    </div>
</div>
