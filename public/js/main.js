/*
 * JS for app 
 */

var Module = (function () {

    var id, name, wardenFlag, status, companyId, companyName, companyStatus;
    var mapCoordinates = [];
    var employees = [];

    // employee object for warden
    function Employee(id, name, status) {
        this.id = id;
        this.name = name;
        this.status = status;
    };

    // map coordinates object
    function Coordinates(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    };

    var getUserDetails = function () {
        // private, todo - call database to get details
        id = 1;
        name = 'Adam Webb';
        wardenFlag = 'Y';
        status = 0; // 0 = normal
        companyId = 1;
        companyName = 'FastEvac';
        companyStatus = 0; // 0 = normal
        var coords = new Coordinates(33.750125, -117.837933); // create faciility coordinates
        mapCoordinates.push(coords);
        coords = new Coordinates(33.750411, -117.838235); // create evac pt 1 coordinates
        mapCoordinates.push(coords);
    };

    var validateLoginCredentials = function () {
        var validLogin = false;

        // todo - get user details from db and authenticate properly
        getUserDetails();
        validLogin = true;

        if (validLogin) {
            if (wardenFlag == 'Y') {
                // todo - initiate employee lists for evac coordinator
                $.mobile.changePage('#alertScreen');
            }
            else {
                //$.mobile.changePage('employeeMap');
            }
        }
        else {
            alert('Invalid Login Credentials');
        }

    };

    var triggerAlert = function () {
        //todo - initiate alert for all employees
        companyStatus = 1; // 1 = alert
        status = 2; //  2 = not checked in
        $.mobile.changePage('#wardenDashboard');
    };

    var setStaticMap = function() {
        var w = $(document).width();
        var h = $(document).height();
        var z = 19;
        var s = 1;
        if (h > 104) {
            h = h - 104;
        }
        if (w > 640 || h > 640) {
            if (w % 2 == 0) {
                w = w/2;
            }
            else {
                w = (w-1)/2;
            }
            if (h % 2 == 0) {
                h = h/2;
            }
            else {
                h = (h-1)/2;
            }
            z = 18;
            s = 2;
        }
        var mapImageURL = 'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=' + mapCoordinates[0].longitude + ',' + mapCoordinates[0].latitude + '&markers=color:green|' + mapCoordinates[1].longitude + ',' + mapCoordinates[1].latitude + '&zoom=' + z + '&scale=' + s + '&size=' + w + 'x' + h;
        $('#static_map_img_warden').attr('src', mapImageURL);
    };
  
    return {
        validateLoginCredentials: validateLoginCredentials,
        triggerAlert: triggerAlert,
        setStaticMap: setStaticMap
    };

})();

$(function(){
    // create event for submitting login form
    $("form").submit(function (event) {
        event.stopPropagation();
        event.preventDefault();
        Module.validateLoginCredentials();
    });

    // navigating to alert page for the first time, create events for initiating evacuation
    $(document).on('pagecreate', '#alertScreen', function() {
        console.log('alert page');
    	$(document).on('click', '.confirm_alert', function(event) {
    		console.log('confirmed alert');
	        event.stopPropagation();
	        event.preventDefault();
            Module.triggerAlert();
	    });
    });

    // navigating to main warden page, initialize events for using the navbar
    $(document).on('pagecreate', '#wardenDashboard', function(){
        console.log('warden dashboard');

        // define google maps img src, todo - add logic for image tailored to specific user
        Module.setStaticMap();

        // need to resize map on device orientation change
        $( window ).on( "throttledresize", Module.setStaticMap );

        // initialize compass
        Compass.initCompass();

        // user clicks on the navbar, hide the currently selected tab content and show the content for the newly selected tab
        $(document).on('click', '.ui-navbar a', function(event)
        {
            console.log('navbar menu item clicked');
            $('.content_div').hide();
            $('#' + $(this).attr('data-href') + '_content').show();
        });

        // specific pages click events - nothing specific implemented as of now
        $(document).on('click', '.warden_map', function(event) {
            console.log('navigated to map');
        });

        $(document).on('click', '.warden_compass', function(event) {
            console.log('navigated to compass');
        });

        $(document).on('click', '.warden_personnel', function(event) {
            console.log('navigated to personnel');
        });

        $(document).on('click', '.warden_status', function(event) {
            console.log('navigated to broadcast');
        });
    });

    // click broadcast message popup, focus textarea
    $(document).on('pageshow', '#broadcast_popup', function(){
        console.log('broadcast message');
        $('#textarea').focus();
    });

    // BEGIN TESTING SECTION
    // END TESTING SECTION
});