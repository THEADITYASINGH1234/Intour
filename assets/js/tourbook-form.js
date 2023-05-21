let tour_date,
  tour_time,
  ticket_monuments,
  guest_adult,
  guest_child,
  fullname,
  mobile,
  email,
  picklocation,
  language,
  comment,
  paystatus;

// DO NOT REMOVE THESE IF YOUR
let user_ticket_monuments = "included";
let ADULT_TICKET_PRICE = 0,
  CHILD_TICKET_PRICE = 0;

function showError(error_no, message) {
  let error_ele = document.querySelectorAll(".input-error");
  if (error_no >= 1) {
    error_ele[error_no - 1].innerHTML = message;
  }
}

function removeError(error_no) {
  let error_ele = document.querySelectorAll(".input-error");
  if (error_no >= 1) {
    error_ele[error_no - 1].innerHTML = "";
  }
}

let tour_object = new FormData();
tour_object.append("payment-mode", 1);

const phoneInputField = document.querySelector("#guest_mobile");
const CustomerMobile = window.intlTelInput(phoneInputField, {
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

document.querySelector("#book_tour_btn").addEventListener("click", function () {
  tour_date = getValue("#tour_date");
  tour_time = getValue("#tour_time");
  guest_adult = getValue("#guest_adult_count");
  guest_child = getValue("#guest_child_count");
  fullname = getValue("#full_name");
  mobile = CustomerMobile.getNumber();
  email = getValue("#guest_email");

  let forword_status = false;
  let tour_date_validate = false,
    tour_time_validate = false,
    guest_child_validate = false,
    guest_adult_validate = false;

  if (tour_date == "") {
    showError(1, "Please enter a tour date");
    tour_date_validate = false;
  } else {
    removeError(1);
    tour_date_validate = true;
    tour_object.delete("tour-date");
    tour_object.append("tour-date", tour_date);
  }

  if (tour_time == "null") {
    showError(2, "Please select a tour time");
    tour_time_validate = false;
  } else {
    removeError(2);
    tour_time_validate = true;
    tour_object.delete("tour-time");
    tour_object.append("tour-time", tour_time);
  }

  if (guest_child != "null" && guest_adult == "null") {
    guest_child_validate = false;
    showError(3, "Please select atleast one adult with a child");
  } else {
    guest_child_validate = true;
    removeError(3);
    if (guest_child != "null") {
      tour_object.delete("guest-child");
      tour_object.append("guest-child", guest_child);
    } else {
      tour_object.delete("guest-child");
      tour_object.append("guest-child", 0);
    }
  }

  if (guest_adult == "null") {
    guest_adult_validate = false;
    showError(3, "Please select atleast one guest adult");
  } else {
    removeError(3);
    guest_adult_validate = true;
    tour_object.delete("guest-adult");
    tour_object.append("guest-adult", guest_adult);
  }

  if (!validate_name(fullname)) {
    showError(4, "Please enter your name");
    return;
  } else {
    removeError(4);
    tour_object.delete("guest-name");
    tour_object.append("guest-name", fullname);
  }

  if (!validate_mobile(mobile)) {
    showError(5, "please enter your valid mobile number");
    return;
  } else {
    removeError(5);
    tour_object.delete("guest-mobile");
    tour_object.append("guest-mobile", mobile);
  }

  if (!validate_mail(email)) {
    showError(6, "Please enter you valid email address");
    return;
  } else {
    removeError(6);
    tour_object.delete("guest-mail");
    tour_object.append("guest-mail", email);
  }

  let tour_comment = document.getElementById("tour-comment").value;
  if (tour_comment != "") {
    tour_object.delete("tour-comment");
    tour_object.append("tour-comment", tour_comment);
  } else {
    tour_object.append("tour-comment", "");
  }

  let guest_pickup_location = document.getElementById(
    "guest-pickup-location"
  ).value;
  if (guest_pickup_location != "") {
    tour_object.delete("guest-pickup-location");
    tour_object.append("guest-pickup-location", guest_pickup_location);
  } else {
    tour_object.append("guest-pickup-location", "");
  }

  if (
    tour_date_validate &&
    tour_time_validate &&
    guest_child_validate &&
    guest_adult_validate &&
    ADULT_TICKET_PRICE + CHILD_TICKET_PRICE > 0
  ) {
    let tour_code = document.getElementById("tour-code").value;
    if (tour_code != "") {
      tour_object.delete("tour-code");
      tour_object.append("tour-code", tour_code);

      tour_object.delete("child-ticket-price");
      tour_object.append("child-ticket-price", CHILD_TICKET_PRICE);
      tour_object.delete("adult-ticket-price");
      tour_object.append("adult-ticket-price", ADULT_TICKET_PRICE);

      tour_object.delete("ticket-monuments");
      tour_object.append(
        "ticket-monuments",
        document.querySelector("#tour_ticket_monument").value
      );

      if (document.querySelector("#guide_langauge").value !== "null") {
        tour_object.delete("guide-langauge_name");
        tour_object.append(
          "guide-langauge_name",
          document.querySelector("#guide_langauge").value
        );
      } else {
        tour_object.append("guide-langauge_name", "");
      }
    }

    var req_params = {};
    for (var pair of tour_object.entries()) {
      req_params[pair[0]] = pair[1];
    }
    console.log(req_params);

    $.ajax({
      type: "POST",
      url: Root.book_tour(),
      data: req_params,
      success: function (response) {
        try {
          console.log(response);
          var response_obj = JSON.parse(response);
          if (response_obj.result == "success") {
            window.location.href = response_obj.data.url;
          } else {
            alert("Some error occurred");
          }
        } catch (e) {
          alert("Some error occurred");
        }
      },
    });
  } else {
    alert("Please fill all important field");
  }
});

document.querySelector("#tour_ticket_monument").onchange = function () {
  set_guest_price(0, 0);
  document.querySelector("#guest_adult_count").selectedIndex = 0;
  document.querySelector("#guest_child_count").selectedIndex = 0;
};

document
  .querySelector("#guest_adult_count")
  .addEventListener("change", function () {
    let price = 0;

    user_ticket_monuments = document.querySelector(
      "#tour_ticket_monument"
    ).value;

    let prefix = "";
    if (user_ticket_monuments == "included") {
      prefix = "in";
    } else {
      prefix = "ex";
    }

    let prefix_1 = "adult";

    if (this.value != "null") {
      price = PRICE_ARRAY[this.value - 1][prefix + prefix_1];
      set_guest_price(price * this.value, CHILD_TICKET_PRICE);
    } else {
      set_guest_price(0, CHILD_TICKET_PRICE);
    }
  });

document
  .querySelector("#guest_child_count")
  .addEventListener("change", function () {
    let price = 0;

    user_ticket_monuments = document.querySelector(
      "#tour_ticket_monument"
    ).value;

    let prefix = "";
    if (user_ticket_monuments == "included") {
      prefix = "in";
    } else {
      prefix = "ex";
    }

    let prefix_1 = "child";

    if (this.value != "null") {
      price = PRICE_ARRAY[this.value - 1][prefix + prefix_1];
      set_guest_price(ADULT_TICKET_PRICE, price * this.value);
    } else {
      set_guest_price(ADULT_TICKET_PRICE, 0);
    }
  });

function set_guest_price(adult_price = 0, child_price = 0) {
  ADULT_TICKET_PRICE = parseInt(adult_price);
  CHILD_TICKET_PRICE = parseInt(child_price);

  document.querySelector("#guest_adult_count_show").value =
    "$ " + ADULT_TICKET_PRICE;
  document.querySelector("#guest_child_count_show").value =
    "$ " + CHILD_TICKET_PRICE;
  document.querySelector("#show_payable_amount").value =
    "$ " + (ADULT_TICKET_PRICE + CHILD_TICKET_PRICE);
}

document.querySelector("#pay_now").addEventListener("click", function () {
  if (tour_object.get("payment-mode") == 0) {
    document
      .querySelector("#pay_now")
      .classList.toggle("payment-option-active");
    document
      .querySelector("#pay_on_arrival")
      .classList.toggle("payment-option-active");
  }

  // payment-mode 1 means use want to pay now
  tour_object.set("payment-mode", 1);
});

document
  .querySelector("#pay_on_arrival")
  .addEventListener("click", function () {
    if (tour_object.get("payment-mode") == 1) {
      document
        .querySelector("#pay_now")
        .classList.toggle("payment-option-active");
      document
        .querySelector("#pay_on_arrival")
        .classList.toggle("payment-option-active");
    }

    // payment-mode 0 means use want to pay latter
    tour_object.set("payment-mode", 0);
  });
