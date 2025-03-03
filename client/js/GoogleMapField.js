/**
 * GoogleMapField.js
 * @author <@willmorgan>
 */
(function ($) {
    var gmapsAPILoaded = false;

    // Run this code for every googlemapfield
    function initField() {
        var field = $(this);

        if (field.data("gmapfield-inited") === true) {
            return;
        }

        field.data("gmapfield-inited", true);

        var settings = JSON.parse(field.attr("data-settings")),
            centre = new google.maps.LatLng(
                settings.center[0],
                settings.center[1]
            ),
            mapSettings = {
                streetViewControl: false,
                zoom: settings.map.zoom * 1,
                center: centre,
                mapTypeId: google.maps.MapTypeId[settings.map.mapTypeId],
            },
            mapElement = field.find(".googlemapfield-map"),
            map = new google.maps.Map(mapElement[0], mapSettings),
            marker = new google.maps.Marker({
                position: map.getCenter(),
                map: map,
                title: "Position",
                draggable: true,
            }),
            latField = field.find(".googlemapfield-latfield"),
            lngField = field.find(".googlemapfield-lngfield"),
            zoomField = field.find(".googlemapfield-zoomfield"),
            boundsField = field.find(".googlemapfield-boundsfield"),
            search = field.find(".googlemapfield-searchfield");

        // Update the hidden fields and mark as changed
        function updateField(latLng, init) {
            var latCoord = latLng.lat(),
                lngCoord = latLng.lng();

            mapSettings.coords = [latCoord, lngCoord];

            updateBounds(init);

            // Mark form as changed if this isn't initialisation
            if (!init) {
                latField.val(latCoord);
                lngField.val(lngCoord);

                $(".cms-edit-form").addClass("changed");
            }
        }

        function updateZoom(init) {
            zoomField.val(map.getZoom());
            // Mark form as changed if this isn't initialisation
            if (!init) {
                $(".cms-edit-form").addClass("changed");
            }
        }

        function updateBounds() {
            var bounds = JSON.stringify(map.getBounds().toJSON());
            boundsField.val(bounds);
        }

        function zoomChanged() {
            updateZoom();
            updateBounds();
        }

        function centreOnMarker() {
            var center = marker.getPosition();
            map.panTo(center);
            updateField(center);
        }

        function mapClicked(ev) {
            var center = ev.latLng;
            marker.setPosition(center);
            centreOnMarker();
        }

        function geolocate() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy,
                    });
                    autocomplete.setBounds(circle.getBounds());
                });
            }
        }

        function geoSearchComplete(result, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                console.warn("Geocoding search failed");
                return;
            }
            marker.setPosition(result[0].geometry.location);
            centreOnMarker();
        }

        if (search) {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            var autocomplete = new google.maps.places.Autocomplete(
                search.get(0)
            );

            geolocate();

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener("place_changed", function () {
                var place = autocomplete.getPlace();

                if (place) {
                    search.val(place.formatted_address);

                    marker.setPosition(place.geometry.location);
                    updateField(place.geometry.location, false);
                    centreOnMarker();
                }
            });
        }

        function searchReady(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var searchText = search.val(),
                geocoder;
            if (searchText) {
                geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: searchText }, geoSearchComplete);
            }
        }

        // Populate the fields to the current centre
        google.maps.event.addListenerOnce(map, "idle", function () {
            updateField(map.getCenter(), true);
            updateZoom(init);
        });

        google.maps.event.addListener(marker, "dragend", function (evt) {
            centreOnMarker();

            if (latField) {
                latField.val(evt.latLng.lat().toFixed(5));
            }

            if (lngField) {
                lngField.val(evt.latLng.lng().toFixed(5));
            }
        });

        google.maps.event.addListener(map, "click", mapClicked);

        google.maps.event.addListener(map, "zoom_changed", zoomChanged);

        search.on({
            change: searchReady,
            keydown: function (ev) {
                if (ev.which == 13) {
                    searchReady(ev);
                }
            },
        });
    }

    $.fn.gmapfield = function () {
        return this.each(function () {
            initField.call(this);
        });
    };

    function init() {
        var mapFields = $(".googlemapfield:visible").gmapfield();
        mapFields.each(initField);
    }

    // Export the init function
    window.googlemapfieldInit = function () {
        gmapsAPILoaded = true;
        init();
    };

    // CMS stuff: set the init method to re-run if the page is saved or pjaxed
    // there are no docs for the CMS implementation of entwine, so this is hacky
    if (!!$.fn.entwine && $(document.body).hasClass("cms")) {
        (function setupCMS() {
            var matchFunction = function () {
                if (gmapsAPILoaded) {
                    init();
                }
            };
            $.entwine("googlemapfield", function ($) {
                $(".cms-tabset").entwine({
                    onmatch: matchFunction,
                });
                $(".cms-tabset-nav-primary li").entwine({
                    onclick: matchFunction,
                });
                $(".ss-tabset li").entwine({
                    onclick: matchFunction,
                });
                $(".cms-edit-form").entwine({
                    onmatch: matchFunction,
                });
            });
        })();
    }
})(jQuery);
