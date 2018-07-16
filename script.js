$(document).ready(function() {
    generate_part();
    generate_unit(40);
    var lptd_info = {
        "total": "40",
        "file_name": "ListeningPracticeThroughDictation_",
        "folder": "file listen/ListeningPracticeThroughDictation_"
    };
    var mina_info = {
        "total": "50",
        "file_name": "ListeningPracticeThroughDictation_",
        "folder": "file listen/Mina no Nihongo"
    };
    var shadowing_info = {
        "total": "42",
        "file_name": "ListeningPracticeThroughDictation_",
        "folder": "file listen/Shadowing"
    };
    $('#type').change(function(){
        if($(this).val() === 'lptd'){
            $('#part').css('display', 'initial');
            generate_unit(lptd_info.total);
        }else{
            if($(this).val() === 'mina'){
                generate_unit(mina_info.total);
            }
            if($(this).val() === 'shadowing'){
                generate_unit(shadowing_info.total);
            }
            $('#part').css('display', 'none');
        }
    });
    $('#get_file').click(function() {
        $('#select_file').hide();
        $('#show_select').show();
        handleFile();
    });
    $('#show_select').click(function() {
        $('#select_file').show();
        $('#show_select').hide();
    });
    function handleFile(event) {
        var type = $('#type').val();
        var part = $('#part').val();
        var unit = $('#unit').val();
        var speed = 1.25;
        var audio = document.getElementById("play_file");
        var file_name = '';
        if(Array.isArray(unit) === false){
            unit = [unit];
        }

        var i = 0, j = 1;
        $("#count").text(j);
        file_name = 'ListeningPracticeThroughDictation_' + part + '-' + unit[0];
        audio.src = 'file listen/ListeningPracticeThroughDictation_' + part + '/' + file_name + '.mp3';
        document.getElementById("script").src = "img/" + file_name + ".PNG";
        audio.load();
        audio.playbackRate = speed;
        audio.play();
        scroll();
        audio.addEventListener('ended', function () {
            i = ++i < unit.length ? i : 0;
            file_name = 'ListeningPracticeThroughDictation_' + part + '-' + unit[i];
            audio.src = 'file listen/ListeningPracticeThroughDictation_' + part + '/' + file_name + '.mp3';
            document.getElementById("script").src = "img/" + file_name + ".PNG";
            audio.load();
            audio.playbackRate = speed;
            audio.play();
            scroll();
            i == 0 ? j++ : false ;
            $("#count").text(j);
        }, true); 
    }

    function scroll(){
        window.scrollTo(document.body.scrollHeight, 0)
        setTimeout(function(){
            var interval = setInterval(function(){
                window.scrollBy(0, 1);
                if($(window).scrollTop() + $(window).height() == $(document).height()){
                    clearInterval(interval);
                }
            });
        },40000);
    }

    function generate_part(){
        for(var i = 1; i <= 4; i++){
            var option = ('<option value="' + i +'"> Part ' + i + '</option>')
            $('#part').append(option);
        }	
    }

    function generate_unit(total){
        $('#unit').empty();
        for(var i = 1; i <= total; i++){
            var val = i.toString().length === 1 ? ('0' + i) : i;
            var option = $('<option value="' + val +'"> Unit ' + val + '</option>')
            $('#unit').append(option);
        }	
    }
});