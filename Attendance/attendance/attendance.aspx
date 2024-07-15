<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="attendance.aspx.cs" Inherits="Attendance.attendance.attendance" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <main>
    <section>
        <div class="row">
            <p>
                <string>根據瀏覽器連線時的IP 智能的呈現不同選項</string></p>
            <p>桃園慈場Wifi開頭 10.10.3.*、10.10.1.*</p>
            <asp:Panel ID="p_inhochi" runat="server">
                <h2>連接到慈場Wifi/IP，呈現慈場會使用到的選項</h2>
                <main>
                    <section>
                        <div class="row align-items-center">
                            <div class="col">
                                <asp:CheckBox ID="cb_morning_up_in_hochi" runat="server" Text="晨光上" CssClass="form-check-inline" Font-Size="Large" />
                            </div>
                            <div class="col">
                                <asp:CheckBox ID="cb_morning_down_in_hochi" runat="server" Text="晨光下" CssClass="form-check-inline" Font-Size="Larger" />

                            </div>
                            <div class="col">
                                <asp:CheckBox ID="cb_morning_meetnig_in_hochi" runat="server" Text="晨會" CssClass="form-check-inline" Font-Size="Large" />
                            </div>
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_start" class="btn btn-primary" runat="server" Text="到班" OnClick="bt_start_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_end" class="btn btn-secondary" runat="server" Text="下班" OnClick="bt_end_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_going_out_on_business" class="btn btn-warning" runat="server" Text="稍後外出公務" OnClick="bt_going_out_on_business_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_come_back" class="btn btn-info" runat="server" Text="回崗" OnClick="bt_come_back_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_dayoff" class="btn btn-warning" runat="server" Text="稍後請假" OnClick="bt_dayoff_Click" />
                        </div>

                    </section>
                </main>
            </asp:Panel>
            <asp:Panel ID="p_outhochi" runat="server">
                <h2>外部IP連接，呈現非慈場會使用到的選項</h2>
                <main>
                    <section>
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="form-check">
                                    <asp:CheckBox ID="cb_morning_up_out_hochi" runat="server" Text="晨光上" CssClass="form-check-inline" Font-Size="Large" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-check">
                                    <asp:CheckBox ID="cb_morning_down_out_hochi" runat="server" Text="晨光下" CssClass="form-check-inline" Font-Size="Larger" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-check">
                                    <asp:CheckBox ID="cb_morning_meetnig_out_hochi" runat="server" Text="晨會" CssClass="form-check-inline" Font-Size="Large" />
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_outside_business" class="btn btn-primary" runat="server" Text="外出公務" OnClick="bt_outside_business_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_sick_leave" class="btn btn-danger" runat="server" Text="請病假" OnClick="bt_sick_leave_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_menstrual_leave" class="btn btn-warning" runat="server" Text="請生理假" OnClick="bt_menstrual_leave_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_personal_leave"  class="btn btn-light" runat="server" Text="請事假" OnClick="bt_personal_leave_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_compensatory_leave" class="btn btn-success" runat="server" Text="補休" OnClick="bt_compensatory_leave_Click" />
                        </div>
                        <p></p>
                        <div class="row align-items-start">
                            <asp:Button ID="bt_specaial_leave" class="btn btn-success" runat="server" Text="特休" OnClick="bt_specaial_leave_Click" />
                        </div>
                        <p></p>
                    </section>
                </main>
            </asp:Panel>
        </div>
    </section>
</main>

</asp:Content>
