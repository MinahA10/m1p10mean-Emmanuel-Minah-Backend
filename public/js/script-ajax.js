$(function(){
    let fullUrl = window.location.href;
    let splitUrl = fullUrl.split("/");
    let urlApp = splitUrl[0]+"//"+splitUrl[2]+"/";

    function formatMillier(nombre) {
        return nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    $(document).on("change", "#fileInput", function(e){
        const file = this.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            saveImage(formData);
        }
    });

    function saveImage(formData) {
        $.ajax({
            url: urlApp+'auth/update-photo-user',
            type: 'post',
            data: formData,
            contentType: false, // Nécessaire pour envoyer des fichiers via FormData
            processData: false, // Nécessaire pour envoyer des fichiers via FormData
            success: function(response) {
                if(response.resultat){
                    location.reload();
                    console.log('Chemin de l\'image enregistré avec succès');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de l\'enregistrement du chemin de l\'image :', error);
            }
        });
    }

    $(document).on("click", "#btn-display-modif-profile", function(e){
        e.preventDefault();
        $('#display-modif-profile').removeClass('display-none');
        $('#display-profile').addClass('display-none');
        const specialityElement = document.querySelectorAll('.form-check-inline > label:last-child');
        const specialityList = []
        specialityElement.forEach(element => {
            specialityList.push(element.textContent);
        });
        $.ajax({
            url: urlApp+"auth/ajax-simple-user",
            type: "get",
            dataType: "json",
            success: function(response){
                specialityList.forEach(speciality => {
                    if(response.speciality.includes(speciality))
                    {
                        let specialityFormat = speciality.replace(" ", "_");
                        $("#"+specialityFormat).prop('checked', true);
                    }
                });
            }
        });
    });

    $(document).on("click", "#btn-close-modif-profile", function(e){
        e.preventDefault();
        $('#display-modif-profile').addClass('display-none');
        $('#display-profile').removeClass('display-none');
        const specialityElement = document.querySelectorAll('.form-check-inline > label:last-child');
        const specialityList = []
        specialityElement.forEach(element => {
            specialityList.push(element.textContent);
        });
        $.ajax({
            url: urlApp+"auth/ajax-simple-user",
            type: "get",
            dataType: "json",
            success: function(response){
                specialityList.forEach(speciality => {
                    if(!response.speciality.includes(speciality))
                    {
                        let specialityFormat = speciality.replace(" ", "_");
                        $("#"+specialityFormat).prop('checked', false);
                    }
                });
            }
        });
    });

    $(document).on("click", "#modificationServices", function(e){
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            url: urlApp+"auth/ajax-services/"+id,
            type: "get",
            dataType: "json",
            success: function(response){
                $("#servicesModifId").val(response._id);
                $('#name').val(response.name);
                $('#price').val(response.price);
                $('#duration').val(response.duration);
                $('#commission').val(response.commission);
                const select = document.querySelectorAll('#type option');
                select.forEach(element => {
                    if(element.textContent === response.type){
                        element.setAttribute('selected', '');
                    }
                });
            }
        });
    });

    $(document).on("click", "#close_modif_service", function(e){
        e.preventDefault();
        const select = document.querySelectorAll('#type option');
            select.forEach(element => {
               element.removeAttribute('selected');
        });
    });

    $(document).on("click", "#suppressionServices", function(e){
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            url: urlApp+"auth/ajax-services/"+id,
            type: "get",
            dataType: "json",
            success: function(response){
                $("#label_suppression_service").text(response.name);
                $("#servicesSuppId").val(response._id);
            }
        });
    });

    $(document).on("click", "#confirmationPortefeuille", function(e){
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            url: urlApp+"auth/ajax-wallet/"+id,
            type: "get",
            dataType: "json",
            success: function(response){
                $('#label_confirmation_portefeuille_nom').text(response.clients.name);
                $('#label_confirmation_portefeuille_montant').text(formatMillier(response.credit).concat(' Ar'));
                $('#walletsId').val(response._id);
            }
        });
    });

    $(document).on("click", "#statusUsers", function(e){
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            url: urlApp+"auth/ajax-user/"+id,
            type: "get",
            dataType: "json",
            success: function(response){
                let status = response.statut ? 'désactivé' : 'activé';
                $('#label_status_user').text(status);
                $('#label_name_user').text(response.firstName+' '+response.lastName);
                $('#statusUser').val(response.statut);
                $('#usersId').val(response._id);
            }
        });
    });
});