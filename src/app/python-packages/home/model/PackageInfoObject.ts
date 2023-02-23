export class PackageInfoObject {
  constructor( public name: string = "", public tags: Array<string>, public versions: string = "", 
  public info: Info) {}
}

export class Info {
  constructor(public description: string = "", public version: string = "",
   public installCommand: string, public usageNotes: string = "",
   public linkToSite: string = "", public siteName: string = "",
   public license: string = "", public linkToLicense: string) {}
}
