-- ----------------------------------------------------------
-- MDB Tools - A library for reading MS Access database files
-- Copyright (C) 2000-2011 Brian Bruns and others.
-- Files in libmdb are licensed under LGPL and the utilities under
-- the GPL, see COPYING.LIB and COPYING files respectively.
-- Check out http://mdbtools.sourceforge.net
-- ----------------------------------------------------------

SET client_encoding = 'UTF-8';

CREATE TABLE "Commodity"
 (
	"Commodity"			VARCHAR (4), 
	"Context"			VARCHAR (50)
);

-- CREATE INDEXES ...

CREATE TABLE "FAF44_HiLoForecasts"
 (
	"fr_orig"			VARCHAR (510), 
	"dms_orig"			VARCHAR (510), 
	"dms_dest"			VARCHAR (510), 
	"fr_dest"			VARCHAR (510), 
	"fr_inmode"			VARCHAR (510), 
	"dms_mode"			VARCHAR (510), 
	"fr_outmode"			VARCHAR (510), 
	"sctg2"			VARCHAR (510), 
	"trade_type"			VARCHAR (510), 
	"tons_2012"			DOUBLE PRECISION, 
	"tons_2013"			DOUBLE PRECISION, 
	"tons_2014"			DOUBLE PRECISION, 
	"tons_2015"			DOUBLE PRECISION, 
	"tons_2020"			DOUBLE PRECISION, 
	"tons_2025"			DOUBLE PRECISION, 
	"tons_2030"			DOUBLE PRECISION, 
	"tons_2035"			DOUBLE PRECISION, 
	"tons_2040"			DOUBLE PRECISION, 
	"tons_2045"			DOUBLE PRECISION, 
	"tons_2020_opt"			DOUBLE PRECISION, 
	"tons_2025_opt"			DOUBLE PRECISION, 
	"tons_2030_opt"			DOUBLE PRECISION, 
	"tons_2035_opt"			DOUBLE PRECISION, 
	"tons_2040_opt"			DOUBLE PRECISION, 
	"tons_2045_opt"			DOUBLE PRECISION, 
	"tons_2020_pes"			DOUBLE PRECISION, 
	"tons_2025_pes"			DOUBLE PRECISION, 
	"tons_2030_pes"			DOUBLE PRECISION, 
	"tons_2035_pes"			DOUBLE PRECISION, 
	"tons_2040_pes"			DOUBLE PRECISION, 
	"tons_2045_pes"			DOUBLE PRECISION, 
	"value_2012"			DOUBLE PRECISION, 
	"value_2013"			DOUBLE PRECISION, 
	"value_2014"			DOUBLE PRECISION, 
	"value_2015"			DOUBLE PRECISION, 
	"value_2020"			DOUBLE PRECISION, 
	"value_2025"			DOUBLE PRECISION, 
	"value_2030"			DOUBLE PRECISION, 
	"value_2035"			DOUBLE PRECISION, 
	"value_2040"			DOUBLE PRECISION, 
	"value_2045"			DOUBLE PRECISION, 
	"value_2020_opt"			DOUBLE PRECISION, 
	"value_2025_opt"			DOUBLE PRECISION, 
	"value_2030_opt"			DOUBLE PRECISION, 
	"value_2035_opt"			DOUBLE PRECISION, 
	"value_2040_opt"			DOUBLE PRECISION, 
	"value_2045_opt"			DOUBLE PRECISION, 
	"value_2020_pes"			DOUBLE PRECISION, 
	"value_2025_pes"			DOUBLE PRECISION, 
	"value_2030_pes"			DOUBLE PRECISION, 
	"value_2035_pes"			DOUBLE PRECISION, 
	"value_2040_pes"			DOUBLE PRECISION, 
	"value_2045_pes"			DOUBLE PRECISION, 
	"tmiles_2012"			DOUBLE PRECISION, 
	"tmiles_2013"			DOUBLE PRECISION, 
	"tmiles_2014"			DOUBLE PRECISION, 
	"tmiles_2015"			DOUBLE PRECISION, 
	"tmiles_2020"			DOUBLE PRECISION, 
	"tmiles_2025"			DOUBLE PRECISION, 
	"tmiles_2030"			DOUBLE PRECISION, 
	"tmiles_2035"			DOUBLE PRECISION, 
	"tmiles_2040"			DOUBLE PRECISION, 
	"tmiles_2045"			DOUBLE PRECISION, 
	"curval_2013"			DOUBLE PRECISION, 
	"curval_2014"			DOUBLE PRECISION, 
	"curval_2015"			DOUBLE PRECISION
);

-- CREATE INDEXES ...

CREATE TABLE "iZone"
 (
	"Zone"			VARCHAR (6), 
	"Context"			VARCHAR (188)
);

-- CREATE INDEXES ...

CREATE TABLE "izone_long"
 (
	"Zone"			VARCHAR (6), 
	"Context"			VARCHAR (188)
);

-- CREATE INDEXES ...

CREATE TABLE "Mode"
 (
	"Mode"			VARCHAR (2), 
	"Context"			VARCHAR (50)
);

-- CREATE INDEXES ...

CREATE TABLE "State"
 (
	"State"			VARCHAR (4), 
	"Context"			VARCHAR (30)
);

-- CREATE INDEXES ...

CREATE TABLE "Trade"
 (
	"Trade"			VARCHAR (2), 
	"Context"			VARCHAR (28)
);

-- CREATE INDEXES ...

CREATE TABLE "Zone"
 (
	"Zone"			VARCHAR (510), 
	"Context"			VARCHAR (510)
);

-- CREATE INDEXES ...

CREATE TABLE "Zone_Long"
 (
	"Zone"			VARCHAR (6), 
	"Context"			VARCHAR (188)
);

-- CREATE INDEXES ...


-- CREATE Relationships ...
ALTER TABLE "MSysNavPaneGroups" ADD CONSTRAINT "MSysNavPaneGroups_GroupCategoryID_fk" FOREIGN KEY ("GroupCategoryID") REFERENCES "MSysNavPaneGroupCategories"("Id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "MSysNavPaneGroupToObjects" ADD CONSTRAINT "MSysNavPaneGroupToObjects_GroupID_fk" FOREIGN KEY ("GroupID") REFERENCES "MSysNavPaneGroups"("Id") ON UPDATE CASCADE ON DELETE CASCADE;
