QUnit.test('test1', function(assert) {
    $("#test").html('<div>宝宝吧111</div>');
    assert.equal( $('div', $("#test")).length, 1, "试试看" );
});
QUnit.test('test2', function(assert) {
    $("#test").html('<div>宝宝吧222</div>');
    assert.equal( $('div', $("#test")).length, 1, "试试看" );
});