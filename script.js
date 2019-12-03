$(document).ready(function () {
    let data = [];
    let speed = $('#speed').val();
    let audio = document.getElementById("play_file");
    let unit = '';
    let src = '';
    let played_units = [];
    let played_count = 1;
    get_data();

    $('#type').change(function () {
        let type = $(this).val();
        generate_part(data[type]);
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

    $('#speed').change(function () {
        speed = $(this).val();
        audio.pause();
        audio.playbackRate = speed;
        audio.play();
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

        process_src();
        audio.addEventListener('ended', function () {
            process_src();
        }, true);
    }

    function process_src() {
        let type = $('#type').val();
        let part = $('#part').val();
        unit = $('#unit').val();

        if (Array.isArray(unit) === false) {
            unit = [unit];
        }

        // process unit_position
        let unit_position = 0;
        while (true) {
            unit_position = Math.floor(Math.random() * unit.length);

            if (played_units.includes(unit_position) == true) {
                if (played_units.length == unit.length) {
                    played_units = [];
                    played_count++;
                }
            } else {
                played_units.push(unit_position);
                break;
            }
        }


        $("#count").text(played_count);

        // TODO Script
        // document.getElementById("script").src = "";

        $("#file_name").text(unit[unit_position]);

        src = data[type][part][unit[unit_position]];

        audio.src = src;
        audio.load();
        audio.playbackRate = speed;
        audio.play();
    }

    function generate_part(type) {
        $('#part').empty();

        for (const key in type) {
            if (type.hasOwnProperty(key)) {
                let option = $('<option value="' + key + '">' + type[key]["name"] + '</option>')
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
            if (part_data.hasOwnProperty(key) && key.toString() != "name") {
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
                        $('#type').append('<option value="' + key + '">' + result['menu'][key] + '</option>');
                    }
                }

                //Generate part of first type
                let first_type = Object.keys(result['menu'])[0];
                generate_part(data[first_type]);

                //Generate unit of first part
                generate_unit(first_type);
            }
        });
    }
});