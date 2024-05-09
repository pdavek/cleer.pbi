const codeInput = document.getElementById('code-input');
const codeDisplay = document.getElementById('code-display');

function setupTabIndent(element) {
    element.addEventListener('keydown', function(event) {
        // Check if the tab key is pressed
        if (event.key === 'Tab') {
            // Prevent the default tab behavior
            event.preventDefault();

            // Insert a tab character (or spaces) at the cursor position
            var tabCharacter = '    '; // Use two spaces for indentation, you can adjust this as needed
            document.execCommand('insertText', false, tabCharacter);
        }
    });
}

// Example usage:
setupTabIndent(codeInput);

function handlePlaceholder() {
    if (codeInput.innerText.trim() === "") {
        codeInput.innerText = "Write your DAX here...";
    }
}

// Event listener to handle focus
codeInput.addEventListener('focus', function() {
    if (codeInput.innerText === "Write your DAX here...") {
        codeInput.innerText = "";
    }
});

// Event listener to handle typing
codeInput.addEventListener('input', function() {
    if (codeInput.innerText === "Write your DAX here...") {
        codeInput.innerText = "";
    }
});

// Event listener to handle blur
codeInput.addEventListener('blur', function() {
    handlePlaceholder();
});

// Call the function initially to set the placeholder
handlePlaceholder();

// Function to highlight syntax
function highlightSyntax(input) {
    // Syntax highlighting code...
}

// Update code display with user input
codeInput.addEventListener('input', () => {
    const userInput = codeInput.innerText;
    const formattedInput = highlightSyntax(userInput);
    codeDisplay.innerHTML = formattedInput;
});

// Update code display on page load
window.addEventListener('load', () => {
    const userInput = codeInput.innerText;
    const formattedInput = highlightSyntax(userInput);
    codeDisplay.innerHTML = formattedInput;
});

// Function to highlight syntax
function highlightSyntax(input) {
    // Keywords to highlight in blue
    const blueKeywords = [
        "ABS", "ACCRINT", "ACCRINTM", "ACOS", "ACOSH", "ACOT", "ACOTH", "ADDCOLUMNS", "ADDMISSINGITEMS", 
        "ALL", "ALLCROSSFILTERED", "ALLEXCEPT", "ALLNOBLANKROW", "ALLSELECTED", "AMORDEGRC", "AMORLINC", 
        "AND", "APPROXIMATEDISTINCTCOUNT", "ASIN", "ASINH", "ATAN", "ATANH", "AVERAGE", "AVERAGEA", 
        "AVERAGEX", "BETA.DIST", "BETA.INV", "BITAND", "BITLSHIFT", "BITOR", "BITRSHIFT", "BITXOR", "BLANK", 
        "CALCULATE", "CALCULATETABLE", "CALENDAR", "CALENDARAUTO", "CEILING", "CHISQ.DIST", "CHISQ.DIST.RT", 
        "CHISQ.INV", "CHISQ.INV.RT", "CLOSINGBALANCEMONTH", "CLOSINGBALANCEQUARTER", "CLOSINGBALANCEYEAR", 
        "COALESCE", "COLLAPSE", "COLLAPSEALL", "COLUMNSTATISTICS", "COMBIN", "COMBINA", "COMBINEVALUES", 
        "CONCATENATE", "CONCATENATEX", "CONFIDENCE.NORM", "CONFIDENCE.T", "CONTAINS", "CONTAINSROW", 
        "CONTAINSSTRING", "CONTAINSSTRINGEXACT", "CONVERT", "COS", "COSH", "COT", "COTH", "COUNT", "COUNTA", 
        "COUNTAX", "COUNTBLANK", "COUNTROWS", "COUNTX", "COUPDAYBS", "COUPDAYS", "COUPDAYSNC", "COUPNCD", 
        "COUPNUM", "COUPPCD", "CROSSFILTER", "CROSSJOIN", "CUMIPMT", "CUMPRINC", "CURRENCY", "CURRENTGROUP", 
        "CUSTOMDATA", "DATATABLE", "DATE", "DATEADD", "DATEDIFF", "DATESBETWEEN", "DATESINPERIOD", "DATESMTD", 
        "DATESQTD", "DATESYTD", "DATEVALUE", "DAY", "DB", "DDB", "DEGREES", "DETAILROWS", "DISC", "DISTINCT", 
        "DISTINCTCOUNT", "DISTINCTCOUNTNOBLANK", "DIVIDE", "DOLLARDE", "DOLLARFR", "DURATION", "EARLIER", 
        "EARLIEST", "EDATE", "EFFECT", "ENDOFMONTH", "ENDOFQUARTER", "ENDOFYEAR", "EOMONTH", "ERROR", 
        "EVALUATEANDLOG", "EVEN", "EXACT", "EXCEPT", "EXP", "EXPAND", "EXPANDALL", "EXPON.DIST", 
        "EXTERNALMEASURE", "FACT", "FALSE", "FILTER", "FILTERS", "FIND", "FIRST", "FIRSTDATE", 
        "FIRSTNONBLANK", "FIRSTNONBLANKVALUE", "FIXED", "FLOOR", "FORMAT", "FV", "GCD", "GENERATE", 
        "GENERATEALL", "GENERATESERIES", "GEOMEAN", "GEOMEANX", "GROUPBY", "HASH", "HASONEFILTER", 
        "HASONEVALUE", "HOUR", "IF", "IF.EAGER", "IFERROR", "IGNORE", "INDEX", "INFO.ALTERNATEOFDEFINITIONS", 
        "INFO.ANNOTATIONS", "INFO.ATTRIBUTEHIERARCHIES", "INFO.ATTRIBUTEHIERARCHYSTORAGES", 
        "INFO.CALCULATIONGROUPS", "INFO.CALCULATIONITEMS", "INFO.CHANGEDPROPERTIES", 
        "INFO.COLUMNPARTITIONSTORAGES", "INFO.COLUMNPERMISSIONS", "INFO.COLUMNS", "INFO.COLUMNSTORAGES", 
        "INFO.CULTURES", "INFO.DATACOVERAGEDEFINITIONS", "INFO.DATASOURCES", "INFO.DELTATABLEMETADATASTORAGES", 
        "INFO.DETAILROWSDEFINITIONS", "INFO.DICTIONARYSTORAGES", "INFO.EXCLUDEDARTIFACTS", "INFO.EXPRESSIONS", 
        "INFO.EXTENDEDPROPERTIES", "INFO.FORMATSTRINGDEFINITIONS", "INFO.FUNCTIONS", 
        "INFO.GENERALSEGMENTMAPSEGMENTMETADATASTORAGES", "INFO.GROUPBYCOLUMNS", "INFO.HIERARCHIES", 
        "INFO.HIERARCHYSTORAGES", "INFO.KPIS", "INFO.LEVELS", "INFO.LINGUISTICMETADATA", "INFO.MEASURES", 
        "INFO.MODEL", "INFO.OBJECTTRANSLATIONS", "INFO.PARQUETFILESTORAGES", "INFO.PARTITIONS", 
        "INFO.PARTITIONSTORAGES", "INFO.PERSPECTIVECOLUMNS", "INFO.PERSPECTIVEHIERARCHIES", 
        "INFO.PERSPECTIVEMEASURES", "INFO.PERSPECTIVES", "INFO.PERSPECTIVETABLES", "INFO.QUERYGROUPS", 
        "INFO.REFRESHPOLICIES", "INFO.RELATEDCOLUMNDETAILS", "INFO.RELATIONSHIPINDEXSTORAGES", 
        "INFO.RELATIONSHIPS", "INFO.RELATIONSHIPSTORAGES", "INFO.ROLEMEMBERSHIPS", "INFO.ROLES", 
        "INFO.SEGMENTMAPSTORAGES", "INFO.SEGMENTSTORAGES", "INFO.STORAGEFILES", "INFO.STORAGEFOLDERS", 
        "INFO.STORAGETABLECOLUMNS", "INFO.STORAGETABLECOLUMNSEGMENTS", "INFO.STORAGETABLES", 
        "INFO.TABLEPERMISSIONS", "INFO.TABLES", "INFO.TABLESTORAGES", "INFO.VARIATIONS", "INT", "INTERSECT", 
        "INTRATE", "IPMT", "ISAFTER", "ISATLEVEL", "ISBLANK", "ISCROSSFILTERED", "ISEMPTY", "ISERROR", 
        "ISEVEN", "ISFILTERED", "ISINSCOPE", "ISLOGICAL", "ISNONTEXT", "ISNUMBER", "ISO.CEILING", "ISODD", 
        "ISONORAFTER", "ISPMT", "ISSELECTEDMEASURE", "ISSUBTOTAL", "ISTEXT", "KEEPFILTERS", "KEYWORDMATCH", 
        "LAST", "LASTDATE", "LASTNONBLANK", "LASTNONBLANKVALUE", "LCM", "LEFT", "LEN", "LINEST", "LINESTX", 
        "LN", "LOG", "LOG10", "LOOKUP", "LOOKUPVALUE", "LOWER", "MATCHBY", "MAX", "MAXA", "MAXX", "MDURATION", 
        "MEDIAN", "MEDIANX", "MID", "MIN", "MINA", "MINUTE", "MINX", "MOD", "MONTH", "MOVINGAVERAGE", "MROUND", 
        "NAMEOF", "NATURALINNERJOIN", "NATURALLEFTOUTERJOIN", "NETWORKDAYS", "NEXT", "NEXTDAY", "NEXTMONTH", 
        "NEXTQUARTER", "NEXTYEAR", "NOMINAL", "NONVISUAL", "NORM.DIST", "NORM.INV", "NORM.S.DIST", "NORM.S.INV", 
        "NOT", "NOW", "NPER", "ODD", "ODDFPRICE", "ODDFYIELD", "ODDLPRICE", "ODDLYIELD", "OFFSET", 
        "OPENINGBALANCEMONTH", "OPENINGBALANCEQUARTER", "OPENINGBALANCEYEAR", "OR", "ORDERBY", "PARALLELPERIOD", 
        "PARTITIONBY", "PATH", "PATHCONTAINS", "PATHITEM", "PATHITEMREVERSE", "PATHLENGTH", "PDURATION", 
        "PERCENTILE.EXC", "PERCENTILE.INC", "PERCENTILEX.EXC", "PERCENTILEX.INC", "PERMUT", "PI", "PMT", 
        "POISSON.DIST", "POWER", "PPMT", "PREVIOUS", "PREVIOUSDAY", "PREVIOUSMONTH", "PREVIOUSQUARTER", 
        "PREVIOUSYEAR", "PRICE", "PRICEDISC", "PRICEMAT", "PRODUCT", "PRODUCTX", "PV", "QUARTER", "QUOTIENT", 
        "RADIANS", "RAND", "RANDBETWEEN", "RANGE", "RANK", "RANK.EQ", "RANKX", "RATE", "RECEIVED", "RELATED", 
        "RELATEDTABLE", "REMOVEFILTERS", "REPLACE", "REPT", "RIGHT", "ROLLUP", "ROLLUPADDISSUBTOTAL", "ROLLUPGROUP", 
        "ROLLUPISSUBTOTAL", "ROUND", "ROUNDDOWN", "ROUNDUP", "ROW", "ROWNUMBER", "RRI", "RUNNINGSUM", 
        "SAMEPERIODLASTYEAR", "SAMPLE", "SAMPLEAXISWITHLOCALMINMAX", "SAMPLECARTESIANPOINTSBYCOVER", "SEARCH", 
        "SECOND", "SELECTCOLUMNS", "SELECTEDMEASURE", "SELECTEDMEASUREFORMATSTRING", "SELECTEDMEASURENAME", 
        "SELECTEDVALUE", "SIGN", "SIN", "SINH", "SLN", "SQRT", "SQRTPI", "STARTOFMONTH", "STARTOFQUARTER", 
        "STARTOFYEAR", "STDEV.P", "STDEV.S", "STDEVX.P", "STDEVX.S", "SUBSTITUTE", "SUBSTITUTEWITHINDEX", 
        "SUM", "SUMMARIZE", "SUMMARIZECOLUMNS", "SUMX", "SWITCH", "SYD", "T.DIST", "T.DIST.2T", "T.DIST.RT", 
        "T.INV", "T.INV.2T", "TAN", "TANH", "TBILLEQ", "TBILLPRICE", "TBILLYIELD", "TIME", "TIMEVALUE", 
        "TOCSV", "TODAY", "TOJSON", "TOPN", "TOPNPERLEVEL", "TOPNSKIP", "TOTALMTD", "TOTALQTD", "TOTALYTD", 
        "TREATAS", "TRIM", "TRUE", "TRUNC", "UNICHAR", "UNICODE", "UNION", "UPPER", "USERCULTURE", 
        "USERELATIONSHIP", "USERNAME", "USEROBJECTID", "USERPRINCIPALNAME", "UTCNOW", "UTCTODAY", "VALUE", 
        "VALUES", "VAR.P", "VAR.S", "VARX.P", "VARX.S", "VDB", "WEEKDAY", "WEEKNUM", "WINDOW", "XIRR", "XNPV", 
        "YEAR", "YEARFRAC", "YIELD", "YIELDDISC", "YIELDMAT", "VAR", "RETURN"
    ];

    // Regular expressions for other syntax elements
    const orangeRegex = /(?<!<[^>]*?)(?:[+\-*\/=<>])/g; // Updated regex for orange characters
    const redRegex = /(?<!<[^>]*?)(?:[#$@!&.,?;():\\|])/g; // Updated regex for red characters
    const greenRegex = /(?<!<[^>]*?)(?:['"])/g;

    const purpleRegex = /(?<!<[^>]*?)(?:[{}\[\]])/g; // Updated regex for purple characters

    // Replace each syntax element with highlighted version
    let formattedInput = input;
    formattedInput = formattedInput.replace(orangeRegex, '<span style="color: #ECB25C;">$&</span>'); // Orange syntax
    formattedInput = formattedInput.replace(redRegex, '<span style="color: #EB7575;">$&</span>'); // Red syntax
    formattedInput = formattedInput.replace(greenRegex, '<span style="color: #05B15F;">$&</span>'); // Green syntax
    formattedInput = formattedInput.replace(purpleRegex, '<span style="color: #FB96F7;">$&</span>'); // Purple syntax

    // Highlight keywords in blue
    for (const keyword of blueKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formattedInput = formattedInput.replace(regex, '<span style="color: #5797E2;">$&</span>');
    }

    return formattedInput;
}