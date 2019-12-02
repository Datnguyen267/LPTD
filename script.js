$(document).ready(function () {
    let data = [];
    let speed = 1;
    let audio = document.getElementById("play_file");
    let unit = '';
    let src = '';
    get_data();

    $('#type').change(function () {
        let type = $(this).val();
        generate_part(type);
        generate_unit(type);
    });

    $('#part').change(function () {
        let type = $("#type").val();
        generate_unit(type);
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

    $(window).keypress(function (e) {
        if (e.key === ' ' || e.key === 'Spacebar') {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    })

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

        $("#file_name").text();
        $("#file_name").text(unit[unit_position]);
        document.getElementById("script").src = "";

        // if (type === 'lptd') {
        //     src = data[type + '_' + part][unit[unit_position]];
        //     document.getElementById("script").src = "img/lptd/" + part + unit[unit_position].replace("Unit ", "-") + ".PNG";
        //     speed = 1.25;
        // }
        // else {
        src = data[type][part][unit[unit_position]];
        //     if (type.indexOf('shadowing') !== -1) {
        //         document.getElementById("script").src = "img/shadowing/" + type.replace("shadowing", "") + unit[unit_position].replace("Unit ", "-") + ".PNG";
        //     }
        // }
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

    function generate_part(type) {
        $('#part').empty();
        
        for (const key in type) {
            if (type.hasOwnProperty(key) && key.toString() != "name") {
                let option = $('<option value="' + key + '">' + type[key] + '</option>')
                $('#part').append(option);
            }
        }
    }

    function generate_unit(type) {
        $('#unit').empty();
        let part = $('#part').val();
        let part_data = data[type][part];
        //Generate unit
        for (const key in part_data) {
            if (part_data.hasOwnProperty(key)) {
                let option = $('<option value="' + key + '">' + key + '</option>')
                $('#unit').append(option);
            }
        }
    }

    function get_data() {
        $.ajax({
            url: "data.json",
            success: function (result) {
                data = result['data'];

                //Generate menu
                for (const key in result['menu']) {
                    if (result['menu'].hasOwnProperty(key)) {
                        $('#type').append('<option value="' + key + '">' + result['menu'][key]['name'] + '</option>');
                    }
                }

                //Generate part of first type
                let first_type = Object.keys(result['menu'])[0];
                generate_part(result['menu'][first_type]);

                //Generate unit of first part
                generate_unit(first_type);
            }
        });
    }
});