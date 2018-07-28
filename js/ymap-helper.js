( function( $ ){
    
    var WpYahooMap = function( element ) {
        //divのdata-で渡す
        var divid = "map";
        var lat = 35.66572;
        var lng = 139.73100;
        var zoom = 17;
        var layersetid = Y.LayerSetId.NORMAL;//地図の種類
        var doubleckzoom = true; //ダブルクリックでその位置を中心に地図の縮尺を拡大
        var scrollwlzoom = true; //マウスホイールによる地図の縮尺の切り替え
        var singleckpan = true; //シングルクリックでその位置を中心に地図をスクロール
        var draggg = true; //ドラッグ操作で地図を移動可能にする
        var continuouszoom = false;//ズーム時に、滑らかなアニメーション処理を有効化
        var hybridphoto = false;//航空写真レイヤーセットを写真と注記のハイブリッド表示
        var enableflickscroll = true;//マウス、タッチパネルを短時間で弾いた際に、慣性スクロール
        var enableopenstreetmap = false;//OpenStreetMapレイヤーセットが選択できるよう有効化
        var weatheroverlay = false; //雨雲レーダー情報を重ねる
        var isBaseControl = true; //基本的なコントロールを追加
        var isCenterMarkControl = true;//地図の中心位置を表示
        var isHomeControl = false;//地図の初期位置をホームアイコンとして表示
        var isScaleControl = true;//地図上の距離の目安となるスケールバーを表示
        var isZoomControl = true;//地図の縮尺を変更するためのシンプルなボタンを表示
        var isSliderZoomControlHorizontal = false;//地図の縮尺を変更するための横長スライダー形式のUIを表示
        var isSliderZoomControlVertical = false;//地図の縮尺を変更するための縦長スライダー形式のUIを表示
        var isSearchControl = false;//地図検索のUIを表示
        var markerNo = 1;//マーカーの表示
        
        if ( $( element ).attr('id') ) {
            divid = $( element ).attr('id');
        }
        
        var ymap = new Y.Map( divid, {
            configure : {
                doubleClickZoom : doubleckzoom,
                scrollWheelZoom : scrollwlzoom,
                singleClickPan : singleckpan,
                dragging : draggg,
                continuousZoom : continuouszoom,
                hybridPhoto : hybridphoto,
                enableFlickScroll : enableflickscroll,
                enableOpenStreetMap : enableopenstreetmap,
                weatherOverlay : weatheroverlay
            }
        });
        
        if ( $( element ).attr('layerset') ) {
            layersetid = Y.LayerSetId[$( element ).attr('layerset')];
        }
        
        //

        if ( isBaseControl || isCenterMarkControl ) {
            var ccon = new Y.CenterMarkControl();
            ymap.addControl(ccon);
        }
        if ( isBaseControl || isScaleControl ) {
            var scon = new Y.ScaleControl();
            ymap.addControl(scon);
        }
        
        if ( isSliderZoomControlHorizontal ) {    
            ymap.addControl( new Y.SliderZoomControlHorizontal() );
        } else if ( isSliderZoomControlHorizontal ) {    
            ymap.addControl( new Y.SliderZoomControlVertical() );
        }    
        else {
            if ( isBaseControl ) {
                ymap.addControl( new Y.ZoomControl() );
            }    
        }    
        //    if ( isZoomControl ) {
        //        //isZoomControlがtrueなら以下はfalse
        //        isSliderZoomControlHorizontal = false;
        //        isSliderZoomControlVertical = false;
        //    }
        //}
        //if ( isSliderZoomControlHorizontal ) {
        //    var szcon_h = new Y.SliderZoomControlHorizontal();
        //    ymap.addControl(szcon_h);
        //    //isSliderZoomControlHorizontalがtrueなら以下はfalse
        //    isSliderZoomControlVertical = false;
        //}
        //if ( isSliderZoomControlVertical ) {
        //    var szcon_v = new Y.SliderZoomControlVertical();
        //    ymap.addControl(szcon_v);
        //}
        if ( isSearchControl ) {
            var srcon = new Y.SearchControl();
            ymap.addControl(srcon);
        }
        
    	if ( $( element ).data( 'lat' ) && $( element ).data( 'lng' ) ) {
    		lat = $( element ).data( 'lat' );
    		lng = $( element ).data( 'lng' );
            ymap.drawMap(new Y.LatLng(lat, lng), zoom, layersetid);

            if ( markerNo > 0 ) {
                set_marker(ymap, lat ,lng);
            }
    	} else if ($( element ).data( 'addr' )){

			var address = $( element ).data( 'addr' );
			var request = { query : address };

			var geocoder = new Y.GeoCoder();
			geocoder.execute( request , function( ydf ) {
			    if ( ydf.features.length > 0 ) {
			        var latlng = ydf.features[0].latlng;
		            ymap.drawMap(new Y.LatLng(latlng.Lat, latlng.Lon), zoom, layersetid);
		            
		            if ( markerNo > 0 ) {
		                set_marker(ymap, latlng.Lat ,latlng.Lon);
		            }
			    }
			} );

    	} else {
    		alert('経度:lng緯度:latまたは住所:addrを設定してください。');
    	}
    	
    }
    
    function set_marker(_ymap, _lat, _lng) {
        var marker = new Y.Marker(new Y.LatLng(_lat, _lng));
        _ymap.addFeature(marker);
    }

    function load_func() {
        $( '.wpyahoomap' ).each(function(){
            new WpYahooMap( $( 'div', this ).get( 0 ) );
        });
    }

    if( window.addEventListener ){
        window.addEventListener('load', load_func);
    } else if( window.attachEvent ){
        window.attachEvent('onload', load_func);
    }

} )( jQuery );