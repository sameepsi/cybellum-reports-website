var html = '<div class="container-fluid calculator">'+
	'<div class="row">'+
'<div class="col-md-3 col-sm-3 col-xs-3 top-pad-zero">'+
'<img src="assets/img/logo.png" />'+
'</div>'+
'<div class="col-md-6 col-sm-6 col-xs-6 padding-5">'+
'	<div class="well well-sm bold amount-title">TOTAL FINANCE CHARGE:</div>'+
'</div>'+
'<div class="col-md-3  col-sm-3 col-xs-3 padding-5">'+
'	<div id="smsi_total_finance_charge" class="well well-sm bold amount">$0.00</div>'+
'</div>'+
'</div>'+

'<div class="row">'+
'<div class="col-md-12 padding-5">'+
'	<div class="well">'+
'		<div class="robo-heading">How much do you need?</div>'+


'		<div class="row margin-top-10">'+

'			<div class="col-md-2 col-sm-2 col-xs-2 price">$0.00</div>'+
'			<div class="col-md-7 col-sm-7 col-xs-7">'+

'				<div class="range-container" id="smsi_loan_amount_container">'+
'			<input type="range" class="hide" popup-prefix="$" id="smsi_loan_amount" data-highlight="true" name="slider-1" min="0" max="4000" value="0" step="200" data-popup-enabled="true">'+
'				</div>'+
'			</div>'+
'			<div class="col-md-3  col-sm-3 col-xs-3 price">$4,000</div>'+
'		</div>'+



'	</div>'+
'</div>'+
'</div>'+

'<div class="row">'+
'<div class="col-md-12 padding-5">'+
'	<div class="well">'+


'		<div class="row">'+
'			<div class="col-md-8 col-sm-8 col-xs-8">'+
'				<div class="robo-heading">How long do you need it?</div>'+

'			</div>'+


'			<div class="col-md-4 col-sm-4 col-xs-4">'+
'				<div class="row">'+
'					<div class="col-md-3 col-sm-3 col-xs-3 padding-5">'+
'						<span class="days text-orange" id="smsi_dayswitch">Days</span>'+
'					</div>'+
'					<div class="col-md-4 col-sm-4 col-xs-4 padding-5">'+
'						<label class="switch">'+ 
'						<input onclick="smsi_switchDayMonth()" type="checkbox" id="smsi_day_month_switch" > <span class="sw-slider round"></span>'+
'						</label>'+
'					</div>'+
'					<div class="col-md-3 col-sm-3 col-xs-3 padding-5">'+
'						<span class="days " id="smsi_monthswitch">Months</span>'+
'					</div>'+
'				</div>'+




'			</div>'+
'		</div>'+

'		<div class="row">'+

'			<div class="col-md-2 col-sm-2 col-xs-2 price padding-top-5">'+
'				<span id="smsi_month_day_start">1 DAY</span>'+
'			</div>'+
'			<div class="col-md-7 col-sm-7 col-xs-7" id="smsi_day_month_slider_container">'+
'				<div class="range-container  hide" id="smsi_month_slide_container">'+

'<input type="range" class="hide" id="smsi_month_slide" data-highlight="true" name="slider-1" min="1" max="12" popup-postfix=" Months" value="1" step="1" data-popup-enabled="true">'+
'				</div>'+
'				<div class="range-container" id="smsi_day_slide_container">'+
'					<input type="range" class="hide" id="smsi_day_slide" data-highlight="true" name="slider-1" min="1" popup-postfix=" Days" max="29" value="1" step="1" data-popup-enabled="true">'+

'				</div>'+
'			</div>'+
'			<div class="col-md-3  col-sm-3 col-xs-3 price padding-top-5">'+
'				<span id="smsi_month_day_end">29 DAYS</span>'+
'			</div>'+
'		</div>'+

'	</div>'+
'</div>'+
'</div>'+

'<div class="row">'+
'<div class="col-md-9 col-sm-9 col-xs-9 padding-5">'+
'	<div class="well well-sm text-right normal pad-right-10">TOTAL REPAYMENT:</div>'+
'</div>'+
'<div class="col-md-3 col-sm-3 col-xs-3 padding-5">'+
'	<div class="well well-sm text-center normal amount" id="smsi_total_repayment">$0.00</div>'+
'</div>'+
'</div>'+

'<div class="row">'+
'<div class="col-md-12 padding-5">'+
'	<div class="robo-regular">'+
'		<span class="robo-bold">CALCULATOR ASSUMES 279.5% APR.</span> THE FLEX LOAN IS AFFORDABLE AS A SHORT-TERM SOLUTION.</div>'+
'</div>'+
'</div>'+

'</div>';




var smsiHead ='<link rel="stylesheet" href="assets/TwitterBootstrap/css/bootstrap.min.css" />'+
	'<script src="assets/TwitterBootstrap/js/bootstrap.min.js"></script>'+
	'<link rel="stylesheet" href="assets/jquery-mobile/jquery.mobile-1.4.5.min.css">'+
	'<script src="assets/jquery-mobile/jquery.mobile-1.4.5.js"></script>'+
	'<link rel="stylesheet" href="assets/css/switch.css" />'+
	'<link rel="stylesheet" href="assets/css/custom.css" />';



function smsiCalculatorInit(id) {
	$('head').append(smsiHead);
	$("#"+id).html(html);
//	smsiEventChange();
}

var tooltipInit = false;

function smsi_switchDayMonth() {
	var smsi_month_day_start = '1 Month';
	var smsi_month_day_end = '12 Months';

	if ($("#smsi_day_month_switch").is(":checked")) {
		$("#smsi_day_slide_container").addClass('hide');
		$("#smsi_month_slide_container").removeClass('hide');
	$("#smsi_dayswitch").removeClass('text-orange');
	$("#smsi_monthswitch").addClass('text-orange');
	
	} else {
		$("#smsi_month_slide_container").addClass('hide');
		$("#smsi_day_slide_container").removeClass('hide');
		var smsi_month_day_start = '1 DAY';
		var smsi_month_day_end = '29 DAYS';
		$("#smsi_monthswitch").removeClass('text-orange');
		$("#smsi_dayswitch").addClass('text-orange');
		
	}
	$("#smsi_month_day_start").html(smsi_month_day_start);
	$("#smsi_month_day_end").html(smsi_month_day_end);
	smsiCalculateAmount();
	
	tooltipInit= false;
	smsiEventChange();
	
}

function smsiCalculateAmount() {
	var numofday = $("#smsi_day_slide").val();
	if ($("#smsi_day_month_switch").is(":checked")) {
		var month = $("#smsi_month_slide").val()
		numofday = month * 29;
	}
	var loan_amount = $("#smsi_loan_amount").val();
	var smsi_total_finance_charge = (loan_amount / 100) * 0.77
			* numofday;
	$("#smsi_total_finance_charge").html(
			'$' + smsi_total_finance_charge.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
	var smsi_total_repayment = smsi_total_finance_charge
			+ parseFloat(loan_amount);
	$("#smsi_total_repayment").html('$' + smsi_total_repayment.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

}




function smsiPositionPopup(isToolTip) {
	if(isToolTip) {
		return;
	}
	
	var handles = $(".ui-slider-handle");
	var popups = $(".ui-slider-popup");
	var counter =0;
	handles.each(function(){
		var popup = popups[counter];
		var dstOffset = $(this).offset();
		$(popup).offset( {
			left: dstOffset.left + ( $(this).width() - $(popup).width() ) / 2,
			top: dstOffset.top - $(popup).outerHeight() - 10
		});	
		counter++;
	});
	
	$('.ui-slider-popup').css("display","block");
}


function smsiEventChange() {
	$('.ui-slider-popup').css("display","block");
	smsiPositionPopup(tooltipInit);
	smsiCalculateAmount();
	tooltipInit = true;
}
$(document.body).on('change', '.range-container' ,function(){
	smsiEventChange();
});

