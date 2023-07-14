$(document).bind('keyup', function(e) {
    if(e.which == 39){
        $('.carousel').carousel('next');
    }
    else if(e.which == 37){
        $('.carousel').carousel('prev');
    }
});

$('.carousel').carousel({
  wrap: false
});

$('#getresults').on('click',function(){
    $('#carouselBusinessCase').hide()
    $('#results').show()
});

$('.ppinput').on('change',function(){
    let values = getValues()
    console.log(values);
    calculateResults(values)
});

$('#startbutton').on('click',function(){
    $('.carousel').carousel('next');
});

$('.nextbutton').on('click',function(){
    $('.carousel').carousel('next');
});

function getValues(){
    let values = {}
    values['total_units'] = $('#total_units').val();
    values['avg_price'] = $('#avg_price').val();
    values['avg_man_cost'] = $('#avg_man_cost').val();
    values['new_man_cost'] = values['avg_man_cost'] * 1.5
    values['sold_full_price'] = $('#sold_full_price').val();
    values['sold_80'] = $('#sold_80').val();
    values['sold_50'] = $('#sold_50').val();
    values['sold_0'] = $('#sold_0').val();
    values['stock_outs'] = $('#stock_outs').val();
    values['overhead_costs'] = $('#overhead_costs').val();
    values['new_price'] = $('#new_price').val();
    values['missed_sales'] = $('#missed_sales').val();
    values['season_sales'] = $('#season_sales').val();
    return values
}

function calculateResults(values){
    let oldScenario = {}
    oldScenario['full_price_net'] = (values['avg_price'] - values['avg_man_cost']) * values['total_units'] *  values['sold_full_price']/100;
    oldScenario['sold_80_net'] = (values['avg_price']*0.8 - values['avg_man_cost']) * values['total_units'] *  values['sold_80']/100;
    oldScenario['sold_50_net'] = (values['avg_price']*0.5 - values['avg_man_cost']) * values['total_units'] *  values['sold_50']/100;
    oldScenario['sold_0_net'] = (values['avg_price']*0 - values['avg_man_cost']) * values['total_units'] *  values['sold_0']/100;

    oldScenario['gross_profits'] = oldScenario['full_price_net'] + oldScenario['sold_80_net'] + oldScenario['sold_50_net'] +  oldScenario['sold_0_net'];
    oldScenario['gross_profit_margin'] = oldScenario['gross_profits'] / values['total_units']
    oldScenario['net_profits'] = oldScenario['gross_profits'] - values['overhead_costs']

    let newScenario = {}

    newScenario['new_full_price_sold'] = values['sold_full_price']*1 + values['missed_sales']*1

    newScenario['full_price_net'] = (values['new_price'] - values['new_man_cost']) * values['total_units'] *  newScenario['new_full_price_sold']/100;
    newScenario['sold_80_net'] = (values['new_price']*0.8 - values['new_man_cost']) * values['total_units'] * values['sold_80']/100;
    if(values['season_sales']=="Yes"){
        newScenario['sold_50_net'] = (values['new_price']*0.5 - values['new_man_cost']) * values['total_units'] * values['sold_50']/100;
        newScenario['totalUnits'] = values['total_units'] *  newScenario['new_full_price_sold']/100 + values['total_units'] * values['sold_80']/100 + values['total_units'] * values['sold_50']/100
    } else {
        newScenario['sold_50_net'] = 0;
        newScenario['totalUnits'] = values['total_units'] * newScenario['new_full_price_sold']/100 + values['total_units'] * values['sold_80']/100
    }
    
    newScenario['gross_profits'] = newScenario['full_price_net'] + newScenario['sold_80_net'] + newScenario['sold_50_net'];
    newScenario['gross_profit_margin'] = newScenario['gross_profits'] / newScenario['totalUnits']
    newScenario['net_profits'] = newScenario['gross_profits'] - values['overhead_costs']*0.25

    console.log(oldScenario)
    console.log(newScenario)

    profitMarginIncrease = newScenario['gross_profit_margin']/oldScenario['gross_profit_margin']-1
    netIncrease = (newScenario['net_profits']/oldScenario['net_profits']-1)
    manIncrease = (values['new_man_cost']/values['avg_man_cost']-1)

    carbonReduction = (1-(newScenario['totalUnits']/values['total_units']))
    unitReduction = newScenario['totalUnits']-values['total_units']

    brandReduction =carbonReduction* 0.77;

    profitMarginIncrease = Number(profitMarginIncrease).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});
    netIncrease = Number(netIncrease).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});
    manIncrease = Number(manIncrease).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});
    carbonReduction = Number(carbonReduction).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});
    brandReduction = Number(brandReduction).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});

    $('#result_profit_margin').html(profitMarginIncrease)
    $('#result_net_profits').html(netIncrease)
    $('#result_man_costs').html(manIncrease)
    $('#result_carbon_reduction').html(carbonReduction)
    $('#result_brand_reduction').html(brandReduction)
    $('#result_unit_reduction').html(unitReduction)
}

let values = getValues()
calculateResults(values)


