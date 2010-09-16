(function(module, $) {

module("ToggleTiddlerPrivacy plugin", {
	teardown: function() {
		store.removeTiddler("foo");
	}
});

test("isExternal", function() {
	var macro = config.macros.setPrivacy;
	var tiddler = new Tiddler("z");

	tiddler.fields["server.bag"] = "foo_public";
	strictEqual(macro.isExternal(tiddler), false);

	tiddler.fields["server.bag"] = "jon_public";
	strictEqual(macro.isExternal(tiddler), true);

	tiddler.fields["server.bag"] = "anotherfoo_public";
	strictEqual(macro.isExternal(tiddler), true);

	tiddler.fields["server.bag"] = "tiddlyspace";
	strictEqual(macro.isExternal(tiddler), true);
});

test("setBag (change)", function() {
	// setup
	strictEqual(config.extensions.tiddlyspace.currentSpace.name, "foo", "pre test check that foo is the default space.");
	var macro = config.macros.setPrivacy;
	var tiddler = new Tiddler("foo");
	store.addTiddler(tiddler);
	var el = $("<div />").attr("tiddler", "foo")[0];
	var bagInput = $("<input />").attr("edit", "server.bag").val("foo_private").appendTo(el);
	var workspaceInput = $("<input />").attr("edit", "server.workspace").val("recipes/foo_private").appendTo(el);
	var radioPublic = $("<input />").attr("type", "radio").addClass("isPublic").appendTo(el);
	var radioPrivate = $("<input />").attr("type", "radio").addClass("isPrivate").appendTo(el);

	// run
	macro.setBag(el, "foo_public");

	//test
	var tiddler = store.getTiddler("foo");
	strictEqual(bagInput.val(), "foo_public");
	strictEqual(workspaceInput.val(), "bags/foo_public");
	strictEqual(tiddler.fields["server.bag"], "foo_public");
	strictEqual(tiddler.fields["server.workspace"], "bags/foo_public");
	strictEqual(radioPublic.attr("checked"), true);
	strictEqual(radioPrivate.attr("checked"), false);
});

test("setBag", function() {
	// setup
	strictEqual(config.extensions.tiddlyspace.currentSpace.name, "foo", "pre test check that foo is the default space.");
	var macro = config.macros.setPrivacy;
	var tiddler = new Tiddler("foo");
	store.addTiddler(tiddler);
	var el = $("<div />").attr("tiddler", "foo")[0];
	var bagInput = $("<input />").attr("edit", "server.bag").val("foo_private").appendTo(el);
	var workspaceInput = $("<input />").attr("edit", "server.workspace").val("recipes/foo_private").appendTo(el);
	var radioPublic = $("<input />").attr("type", "radio").addClass("isPublic").appendTo(el);
	var radioPrivate = $("<input />").attr("type", "radio").addClass("isPrivate").appendTo(el);

	// run
	macro.setBag(el, "foo_private");
	
	//test
	var tiddler = store.getTiddler("foo");
	strictEqual(bagInput.val(), "foo_private");
	strictEqual(workspaceInput.val(), "bags/foo_private");
	strictEqual(tiddler.fields["server.bag"], "foo_private");
	strictEqual(tiddler.fields["server.workspace"], "bags/foo_private");
	strictEqual(radioPrivate.attr("checked"), true);
	strictEqual(radioPublic.attr("checked"), false);
});

var _readOnly;
module("ToggleTiddlerPrivacy plugin", {
	setup: function() {
		_readOnly = readOnly;
		readOnly = true;
	},
	teardown: function() {
		readOnly = _readOnly;
	}
});

test("hidden in readonly mode", function() {
	var place = $("<div />")[0];
	config.macros.setPrivacy.handler(place);
	strictEqual($(place).children().length, 0);
});

})(QUnit.module, jQuery);
