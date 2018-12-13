$(document).ready(function () {
    let data = [];
    let speed = 1;
    let audio = document.getElementById("play_file");
    let unit = '';
    let src = '';
    get_data();

    $('#type').change(function () {
        if ($('#sub_select').css('display') == 'none') {
            $('#sub_select').css('display', 'inline-block');
        }
        let type = $(this).val();
        if (type === 'lptd') {
            $('#part').css('display', 'initial');
            generate_part();
            generate_unit(type);
        } else {
            $('#part').css('display', 'none');
            generate_unit(type);
        }
    });

    $('#get_file').click(function () {
        $('#select_file').hide();
        $('#show_select').show();
        handleFile();
    });

    $('#show_select').click(function () {
        $('#select_file').show();
        $('#show_select').hide();
    });

    function handleFile() {
        let unit_position = 0, played_count = 1;
        process_src(unit_position);
        play_audio(src, speed);
        $("#count").text(played_count);
        audio.addEventListener('ended', function () {
            unit_position = ++unit_position < unit.length ? unit_position : 0;
            process_src(unit_position);
            play_audio(src, speed);
            unit_position == 0 ? played_count++ : false;
            $("#count").text(played_count);
        }, true);
    }

    function play_audio(src, speed) {
        audio.src = src;
        audio.load();
        audio.playbackRate = speed;
        audio.play();
    }

    function process_src(unit_position) {
        let type = $('#type').val();
        let part = $('#part').val();
        unit = $('#unit').val();

        if (Array.isArray(unit) === false) {
            unit = [unit];
        }

        if (type === 'lptd') {
            src = data[type + '_' + part][unit[unit_position]];
            document.getElementById("script").src = "img/" + part + '-' + unit[unit_position] + ".PNG";
            speed = 1.25;
        }
        else {
            src = data[type][unit[unit_position]];
        }
    }

    function scroll() {
        window.scrollTo(document.body.scrollHeight, 0)
        setTimeout(function () {
            let interval = setInterval(function () {
                window.scrollBy(0, 1);
                if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                    clearInterval(interval);
                }
            });
        }, 40000);
    }

    function generate_part() {
        for (let i = 1; i <= 4; i++) {
            let option = ('<option value="' + i + '"> Part ' + i + '</option>')
            $('#part').append(option);
        }
    }

    function generate_unit(type) {
        $('#unit').empty();
        let unit_type = type == 'lptd' ? data[type + '_' + $('#part').val()] : data[type];

        //Generate unit
        for (const key in unit_type) {
            if (unit_type.hasOwnProperty(key)) {
                let option = $('<option value="' + key + '">' + key + '</option>')
                $('#unit').append(option);
            }
        }
    }

    function get_data() {
        $.ajax({
            url: "data.json",
            success: function (result) {
                data = result;
            }
        });
    }
});