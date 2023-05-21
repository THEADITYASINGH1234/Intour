document.getElementById("send_form").addEventListener("click", function () {
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let mail = document.getElementById("mail").value;
    let mobile = document.getElementById("mobile").value;
    let message = document.getElementById("message").value;



    let fname_error = validate_name(fname);
    let lname_error = validate_name(lname);
    let mail_error = validate_mail(mail);
    let mobile_error = validate_mobile(mobile);
    let message_error = false;


    if (message != "") {
        message_error = true;
    }

    if (fname_error && lname_error && mail_error && mobile_error && message_error) {

        let req_params = new FormData();
        req_params.append("fname", fname);
        req_params.append("lname", lname);
        req_params.append("mail", mail);
        req_params.append("mobile", mobile);
        req_params.append("message", message);

        $.ajax({
            type: "POST",
            url: 'https://helloindiatour.com/manager/mail.php',
            data: req_params,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                if (response == "ok") {
                    alert('Your Query submitted successfully');
                    window.location.reload();
                }
            }
        });
    } else {
        if (!fname_error) {
            document.getElementById("input-error-fname").innerHTML = "Please enter first name";


        } else {
            document.getElementById("input-error-fname").innerHTML = "";
        }

        if (!lname_error) {
            document.getElementById("input-error-lname").innerHTML = "Please enter last name";

        } else {
            document.getElementById("input-error-lname").innerHTML = "";
        }

        if (!mail_error) {
            document.getElementById("input-error-mail").innerHTML = "Please enter a valid mail address";

        } else {
            document.getElementById("input-error-mail").innerHTML = "";
        }

        if (!mobile_error) {
            document.getElementById("input-error-mobile").innerHTML = "Please enter a valid mobile no";

        } else {
            document.getElementById("input-error-mobile").innerHTML = "";
        }

        if (!message_error) {
            document.getElementById("input-error-message").innerHTML = "Please enter your message";

        } else {
            document.getElementById("input-error-message").innerHTML = "";
        }
    }

})



